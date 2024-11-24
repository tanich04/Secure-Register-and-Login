const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy database as an object (in-memory)
const dummyDatabase = {};

// Constants for Pinata API
const PINATA_API_KEY = '5667c6a31032e2cb737c';
const PINATA_SECRET_API_KEY = '0a0d57dfde498e021c4aa7c918b5ed0e3db08829f06792036fb711aa230a340c';

// Functions for encryption and IPFS
function deriveKey(password) {
    return CryptoJS.SHA256(password).toString();
}

function encryptPassword(plainPassword, derivedKey) {
    return CryptoJS.AES.encrypt(plainPassword, derivedKey).toString();
}

async function storeInIPFS(encryptedPassword) {
    const data = { pinataOptions: { cidVersion: 1 }, pinataContent: encryptedPassword };
    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY
            }
        });
        return response.data.IpfsHash;
    } catch (error) {
        console.error("IPFS upload error:", error);
        return null;
    }
}

// Registration endpoint
app.post('/register', async (req, res) => {
    const { userDetails, email, phone, username, plainPassword, encryptionKeyBase } = req.body;

    // Check if username already exists
    if (dummyDatabase[username]) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    try {
        const encryptionKey = deriveKey(encryptionKeyBase);
        const encryptedPassword = encryptPassword(plainPassword, encryptionKey);

        const ipfsHash = await storeInIPFS(encryptedPassword);

        if (ipfsHash) {
            dummyDatabase[username] = {
                userDetails,
                email,
                phone,  // Optional phone number stored
                ipfsHash,
                registrationDate: new Date().toISOString()
            };

            console.log("User successfully registered:", dummyDatabase[username]);

            res.status(200).json({ message: 'Registration Successful', ipfsHash });
        } else {
            res.status(500).json({ error: 'Failed to store encrypted password in IPFS' });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, plainPassword, encryptionKeyBase } = req.body;

    // Check if username exists
    const user = dummyDatabase[username];
    if (!user) {
        return res.status(400).json({ error: 'Username not found' });
    }

    try {
        // Derive the encryption key using the encryptionKeyBase
        const encryptionKey = deriveKey(encryptionKeyBase);
        const encryptedPassword = encryptPassword(plainPassword, encryptionKey);

        // Compare encrypted passwords
        if (encryptedPassword === user.ipfsHash) {
            res.status(200).json({ message: 'Login Successful' });
        } else {
            res.status(400).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
