const User = require('../models/User');
// Stripe ko real project mein yahan require karenge: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPurchase = async (req, res) => {
    try {
        const { userId, volId } = req.body;

        // 1. Yahan Payment Gateway ka logic aata hai (Stripe/Razorpay)
        // Abhi ke liye hum "Manual Success" maan kar chal rahe hain
        const paymentSuccessful = true; 

        if (paymentSuccessful) {
            // 2. User ko find karein
            const user = await User.findById(userId);

            if (!user) return res.status(404).json({ msg: "User not found" });

            // 3. Check karein ki kahin pehle se toh unlock nahi hai
            if (user.purchasedVolumes.includes(volId)) {
                return res.status(400).json({ msg: "Volume already in your vault" });
            }

            // 4. Volume unlock karein (Array mein add karein)
            user.purchasedVolumes.push(volId);
            await user.save();

            res.json({ 
                msg: `Success! Volume ${volId} is now unlocked in your Digital Vault.`,
                purchasedVolumes: user.purchasedVolumes 
            });
        }
    } catch (err) {
        res.status(500).send("Payment Processing Error");
    }
};