require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { FingerprintJsServerApiClient, Region } = require('@fingerprintjs/fingerprintjs-pro-server-api');

const client = new FingerprintJsServerApiClient({
    apiKey: process.env.SECRET_API_KEY,
    region: Region.Global, // Adjust based on your account's region
});


const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(bodyParser.json());



// Registration endpoint
app.post('/register', async (req, res) => {
    const { email, password, username, visitorId } = req.body;

    try {
        // Check if the email is already registered
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const fingerprintCheck = await pool.query('SELECT * FROM users WHERE fingerprint = $1', [visitorId]);
        if (fingerprintCheck.rows.length > 0) {
            return res.status(400).json({ message: 'This device is already registered with another account. If this is your account, please log in.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database with the fingerprint
        await pool.query('INSERT INTO users (username, email, password, fingerprint) VALUES ($1, $2, $3, $4)', [username, email, hashedPassword, visitorId]);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password, visitorId, requestId } = req.body;

    try {
        // Check if user exists
        const userQueryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQueryResult.rows.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const user = userQueryResult.rows[0];

        // Perform server-side validation using the FingerprintJS Pro Server API
        const event = await client.getEvent(requestId);
        const identificationData = event.products.identification.data;
        const serverVisitorId = identificationData.visitorId;
        const confidence = identificationData.confidence.score;
        const now = Date.now() / 1000;
        const identifiedAt = event.timestamp / 1000;
        const diff = now - identifiedAt;
        const maxRequestLifespan = 60; // seconds
        const minimumConfidenceScore = 0.6;

        // Check the request's validity based on its age
        if (diff > maxRequestLifespan) {
            return res.status(400).json({ message: 'Expired request ID.' });
        }
        console.log({ confidence })

        // Check if the confidence score meets the minimum threshold
        if (confidence < minimumConfidenceScore) {
            return res.status(400).json({ message: 'Low confidence in visitor ID.' });
        }

        // Check if the visitorId matches the stored fingerprint
        if (serverVisitorId !== visitorId || user.fingerprint !== visitorId) {
            return res.status(400).json({ message: 'New Browser Detected' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Login successful
        res.json({ token, user: { username: user.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
