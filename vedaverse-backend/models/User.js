const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    purchasedVolumes: [{ type: Number }], // Example: [1, 2] matlab Vol 1 aur 2 unlock hain
    role: { type: String, default: 'reader' }, // 'reader' or 'admin'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);