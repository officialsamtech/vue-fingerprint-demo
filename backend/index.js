require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { FingerprintJsServerApiClient, Region } = require('@fingerprintjs/fingerprintjs-pro-server-api');



const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(bodyParser.json());

const client = new FingerprintJsServerApiClient({
    apiKey: process.env.SECRET_API_KEY,
    region: Region.Global, // Adjust based on your account's region
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { email, password, username, visitorId, requestId } = req.body;

    try {
        // Perform server-side validation using the FingerprintJS Pro Server API
        const event = await client.getEvent(requestId);
        console.log('Event:', event.products.identification.data);

        const identificationData = event.products.identification.data;
        const serverVisitorId = identificationData.visitorId;
        const confidence = identificationData.confidence.score;

        // Check if the visitorId matches
        if (serverVisitorId !== visitorId) {
            return res.status(400).json({ message: 'Forged visitor ID' });
        }

        const now = Date.now() / 1000;
        const identifiedAt = event.timestamp / 1000;
        const diff = now - identifiedAt;
        const maxRequestLifespan = 60; // seconds
        const minimumConfidenceScore = 0.6;

        // Check the request's validity based on its age
        if (diff > maxRequestLifespan) {
            return res.status(400).json({ message: 'Forged request ID' });
        }

        // Check if the confidence score meets the minimum threshold
        if (confidence <= minimumConfidenceScore) {
            return res.status(400).json({ message: 'Not confident' });
        }

        // Check if fingerprint exists
        const fingerprintCheck = await pool.query('SELECT * FROM users WHERE fingerprint = $1 AND email != $2', [visitorId, email]);
        if (fingerprintCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Device already registered with another account.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        await pool.query('INSERT INTO users (username, email, password, fingerprint) VALUES ($1, $2, $3, $4)', [username, email, hashedPassword, visitorId]);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password, visitorId } = req.body;
    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }

        console.log('user', user.rows)
        // Check if the visitorId matches the stored fingerprint
        if (user.rows[0].fingerprint !== visitorId) {
            return res.status(400).json({ message: 'Unregistered device' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.rows[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Include username in the response
        res.json({ token, user: { username: user.rows[0].username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
