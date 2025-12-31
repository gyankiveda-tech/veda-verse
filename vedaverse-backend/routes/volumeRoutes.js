const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Volume Access Route
router.get('/:volId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const volId = parseInt(req.params.volId);

        // Check if user has purchased this volume
        if (!user.purchasedVolumes.includes(volId)) {
            return res.status(403).json({ msg: "Access Denied: Please purchase this volume to unlock." });
        }

        // Dummy pages for now (Real project mein yahan S3 bucket ke links aayenge)
        const comicData = {
            volume: volId,
            pages: [
                "https://your-s3-bucket.com/vol1/page1.jpg",
                "https://your-s3-bucket.com/vol1/page2.jpg"
            ]
        };

        res.json(comicData);

    } catch (err) {
        res.status(500).send("Server Error accessing Volume");
    }
});

module.exports = router;