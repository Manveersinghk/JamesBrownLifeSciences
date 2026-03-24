const router   = require('express').Router();
const axios    = require('axios');
const OTP      = require('../models/OTP');
const { protect } = require('../middleware/authMiddleware');
const rateLimit   = require('express-rate-limit');

// ── Rate limiter — max 3 OTP requests per IP per 10 min ──────────────────────
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { error: 'Too many OTP requests. Please wait 10 minutes.' },
});

// ── Generate 6-digit OTP ──────────────────────────────────────────────────────
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

// ── Strip country code — Fast2SMS needs 10-digit Indian numbers ───────────────
const cleanIndianNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    // Remove leading 91 or 0
    if (digits.startsWith('91') && digits.length === 12) return digits.slice(2);
    if (digits.startsWith('0')  && digits.length === 11) return digits.slice(1);
    return digits; // assume already 10-digit
};

// ── POST /api/otp/send ────────────────────────────────────────────────────────
router.post('/send', protect, otpLimiter, async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    const cleanPhone = cleanIndianNumber(phone.replace(/\s/g, ''));

    if (!/^\d{10}$/.test(cleanPhone)) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    try {
        // Delete any existing OTP for this phone
        await OTP.deleteMany({ phone: cleanPhone });

        const otp = generateOTP();
        await OTP.create({ phone: cleanPhone, otp });

        // ── Fast2SMS API call ──────────────────────────────────────────────────
        const apiKey = process.env.FAST2SMS_API_KEY;

        if (!apiKey) {
            // DEV mode — print OTP to server console
            console.log(`🔑 DEV MODE OTP for ${cleanPhone}: ${otp}`);
            return res.json({
                success: true,
                message:  'DEV MODE — OTP printed in server console.',
                devOtp:   process.env.NODE_ENV !== 'production' ? otp : undefined,
            });
        }

        const response = await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',
            {
                route:    'otp',
                variables_values: otp,
                flash:    0,
                numbers:  cleanPhone,
            },
            {
                headers: {
                    authorization: apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: 8000,
            }
        );

        if (response.data?.return === true) {
            console.log(`📱 OTP sent to ${cleanPhone} via Fast2SMS`);
            return res.json({ success: true, message: `OTP sent to +91 ${cleanPhone}` });
        } else {
            console.error('Fast2SMS error:', response.data);
            throw new Error(response.data?.message || 'SMS sending failed');
        }

    } catch (err) {
        console.error('OTP send error:', err.message);

        // Axios network error
        if (err.code === 'ECONNABORTED') {
            return res.status(500).json({ error: 'SMS service timeout. Please try again.' });
        }

        return res.status(500).json({ error: 'Failed to send OTP. Please try again or call us at +91 97998 32489.' });
    }
});

// ── POST /api/otp/verify ──────────────────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required.' });
    }

    const cleanPhone = cleanIndianNumber(phone.replace(/\s/g, ''));

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
            return res.status(400).json({
                error: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
            });
        }

        // ✅ Verified
        await OTP.updateOne({ phone: cleanPhone }, { verified: true });
        console.log(`✅ OTP verified for ${cleanPhone}`);
        return res.json({ success: true, message: 'Phone number verified successfully.' });

    } catch (err) {
        console.error('OTP verify error:', err);
        return res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
});

module.exports = router;