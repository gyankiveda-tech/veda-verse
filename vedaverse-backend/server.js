const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const volumeRoutes = require('./routes/volumeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
const app = express();

// --- UPDATED CORS SETTINGS ---
// Isse aapka naya Vercel domain backend se connect ho payega
app.use(cors({
    origin: '*', // Testing ke liye sab allow hai, connection issue solve ho jayega
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("🌌 VedaVerse Database Connected Successfully"))
.catch((err) => console.log("❌ DB Connection Error:", err));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/volumes', volumeRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.send("VedaVerse API is Running... Galactic Gateway Open.");
});

// Render ka PORT fix
const PORT = process.env.PORT || 5000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server navigating at port: ${PORT}`);
});
