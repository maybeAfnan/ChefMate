import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js'; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 

export function authenticateToken(req, res, next) {
    const token = req.cookies.auth_token;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.clearCookie('auth_token');
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}

//register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

    try {
        if (db.findUserByUsername(username)) return res.status(409).json({ message: 'User already exists.' });

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const userId = db.insertUser(username, hashedPassword);

        if (userId) return res.status(201).json({ message: 'User registered successfully. Please log in.' });
        
        return res.status(500).json({ message: 'Failed to insert user into database.' });

    } catch (error) {
        console.error("Registration error: FULL STACK TRACE BELOW");
        console.error(error); 
        
        return res.status(500).json({ message: 'Server error during registration. Check server logs for details.' });
    }
});

//login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db.findUserByUsername(username);
        if (!user || !bcrypt.compareSync(password, user.hashed_password)) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie('auth_token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 86400000 
        });

        return res.json({ message: 'Login successful.' });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
});

//logout
router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout successful.' });
});

//check if a user is logged in
router.get('/status', (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) return res.json({ loggedIn: false, username: null });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ loggedIn: true, username: decoded.username });
    } catch (err) {
        res.clearCookie('auth_token');
        return res.json({ loggedIn: false, username: null });
    }
});


export default router;