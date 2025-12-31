const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const volumeRoutes = require('./routes/volumeRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Naya rasta

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("🌌 VedaVerse Database Connected Successfully"))
.catch((err) => console.log("❌ DB Connection Error:", err));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/volumes', volumeRoutes);
app.use('/api/payment', paymentRoutes); // Payment system active

app.get('/', (req, res) => {
    res.send("VedaVerse API is Running... Galactic Gateway Open.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server navigating at http://localhost:${PORT}`);
});