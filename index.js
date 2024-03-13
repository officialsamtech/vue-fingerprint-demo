require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', async (req, res) => {
    const { email, password, fingerprint, username } = req.body;
    try {
        // Check if fingerprint exists
        const fingerprintCheck = await pool.query('SELECT * FROM users WHERE fingerprint = $1', [fingerprint]);
        if (fingerprintCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Device already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        console.log('Inserting user:', { username, email, password: 'hidden', fingerprint });

        // Insert user into database
        await pool.query(
            'INSERT INTO users (username, email, password, fingerprint) VALUES ($1, $2, $3, $4)',
            [username, email, hashedPassword, fingerprint]
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
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
