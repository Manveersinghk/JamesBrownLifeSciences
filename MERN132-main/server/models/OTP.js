const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone:     { type: String, required: true },
    otp:       { type: String, required: true },
    verified:  { type: Boolean, default: false },
    attempts:  { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: 600 },
});

otpSchema.index({ phone: 1 });

module.exports = mongoose.model('OTP', otpSchema);