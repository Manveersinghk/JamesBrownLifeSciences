const router = require('express').Router();
const twilio = require('twilio');
const OTP    = require('../models/OTP');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// ── Rate limiter — max 3 OTP requests per phone per 10 min ───────────────────
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { error: 'Too many OTP requests. Please wait 10 minutes.' },
});

// ── Twilio client ─────────────────────────────────────────────────────────────
const getTwilioClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error('Twilio credentials not configured');
    }
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

// ── Generate 6-digit OTP ──────────────────────────────────────────────────────
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

// ── POST /api/otp/send ────────────────────────────────────────────────────────
router.post('/send', protect, otpLimiter, async (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^\+?[1-9]\d{7,14}$/.test(phone.replace(/\s/g, ''))) {
        return res.status(400).json({ error: 'Please provide a valid phone number with country code. e.g. +919876543210' });
    }

    const cleanPhone = phone.replace(/\s/g, '');

    try {
        // Delete any existing OTP for this phone
        await OTP.deleteMany({ phone: cleanPhone });

        const otp = generateOTP();

        await OTP.create({ phone: cleanPhone, otp });

        // Send via Twilio
        const client = getTwilioClient();
        await client.messages.create({
            body: `Your James Brown Life Sciences order verification code is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to:   cleanPhone,
        });

        console.log(`📱 OTP sent to ${cleanPhone}`);
        return res.json({ success: true, message: `OTP sent to ${cleanPhone}` });

    } catch (err) {
        console.error('OTP send error:', err.message);

        // Twilio not configured — dev mode, return OTP in response for testing
        if (err.message.includes('Twilio credentials not configured')) {
            const otp = generateOTP();
            await OTP.create({ phone: cleanPhone, otp });
            console.log(`🔑 DEV MODE OTP for ${cleanPhone}: ${otp}`);
            return res.json({
                success: true,
                message: 'DEV MODE: OTP printed in server console',
                devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
            });
        }

        return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});

// ── POST /api/otp/verify ──────────────────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required.' });
    }

    const cleanPhone = phone.replace(/\s/g, '');

    try {
        const record = await OTP.findOne({ phone: cleanPhone });

        if (!record) {
            return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
        }

        if (record.attempts >= 3) {
            await OTP.deleteOne({ phone: cleanPhone });
            return res.status(400).json({ error: 'Too many wrong attempts. Please request a new OTP.' });
        }

        if (record.otp !== String(otp)) {
            await OTP.updateOne({ phone: cleanPhone }, { $inc: { attempts: 1 } });
            const remaining = 3 - (record.attempts + 1);
            return res.status(400).json({ error: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` });
        }

        // Mark as verified
        await OTP.updateOne({ phone: cleanPhone }, { verified: true });

        console.log(`✅ OTP verified for ${cleanPhone}`);
        return res.json({ success: true, message: 'Phone number verified successfully.' });

    } catch (err) {
        console.error('OTP verify error:', err);
        return res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
});

module.exports = router;