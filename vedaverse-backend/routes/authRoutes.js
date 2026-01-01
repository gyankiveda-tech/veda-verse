const express = require('express');
const router = express.Router();
// Humne yahan 'verifyOTP' ko bhi include kar liya hai
const { register, login, verifyOTP } = require('../controllers/authController');

// --- Routes for VedaVerse Authentication ---

// 1. User Registration (Isse OTP email jayega)
router.post('/register', register);

// 2. OTP Verification (Ye naya route hai jo account activate karega)
router.post('/verify-otp', verifyOTP);

// 3. User Login (Ye tabhi kaam karega jab isVerified: true ho)
router.post('/login', login);

module.exports = router;