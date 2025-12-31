const express = require('express');
const router = express.Router();
const { processPurchase } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// Route: POST /api/payment/unlock
router.post('/unlock', auth, processPurchase);

module.exports = router;