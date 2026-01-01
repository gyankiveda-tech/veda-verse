const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Nodemailer Transporter Setup (OTP bhejne ke liye)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Apni Gmail ID .env mein dalein
        pass: process.env.EMAIL_PASS  // Gmail App Password .env mein dalein
    }
});

// User Registration Logic with OTP
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Duplicate Check: Kya email pehle se hai?
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "Email already registered. Please login directly." });
        }

        // 2. OTP Generate karna (6 digit)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Password Encryption
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Temporary User Create karna (Unverified)
        user = new User({
            name,
            email,
            password: hashedPassword,
            otp, // User model mein 'otp' field hona chahiye
            isVerified: false, // User model mein 'isVerified' field hona chahiye
            purchasedVolumes: [1]
        });

        // 5. OTP Email bhejna
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'VedaVerse Account Verification Code',
            text: `Commander ${name}, your verification code is: ${otp}. Do not share it with anyone.`
        };

        await transporter.sendMail(mailOptions);
        await user.save();

        res.status(201).json({ msg: "OTP sent to your email. Please verify to continue." });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error in Registration");
    }
};

// OTP Verification Route
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });
        if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP code" });

        // Account activate karna
        user.isVerified = true;
        user.otp = undefined; // OTP delete kar dena verify hone ke baad
        await user.save();

        res.status(200).json({ msg: "Account verified successfully! You can now login." });
    } catch (err) {
        res.status(500).send("OTP Verification Error");
    }
};

// User Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ msg: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                purchasedVolumes: user.purchasedVolumes
            }
        });

    } catch (err) {
        res.status(500).send("Server Error in Login");
    }
};