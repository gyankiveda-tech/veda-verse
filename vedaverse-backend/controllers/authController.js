const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Password Encryption
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        user = new User({
            name,
            email,
            password: hashedPassword,
            purchasedVolumes: [1] // Volume 1 is free for everyone by default
        });

        await user.save();
        res.status(201).json({ msg: "User registered successfully in VedaVerse" });

    } catch (err) {
        res.status(500).send("Server Error in Registration");
    }
};

// User Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user existence
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // Generate Token
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