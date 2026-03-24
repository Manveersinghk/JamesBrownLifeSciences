const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// ── Rate limiter for auth routes ──────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // 10 attempts per 15 min per IP
    message: { error: 'Too many attempts. Please try again in 15 minutes.' },
});

// ── Helper: generate JWT ──────────────────────────────────────────────────────
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

// ── Helper: send token response ───────────────────────────────────────────────
const sendToken = (res, user, statusCode = 200) => {
    const token = generateToken(user._id);
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id:           user._id,
            firstName:    user.firstName,
            lastName:     user.lastName,
            email:        user.email,
            role:         user.role,
            organization: user.organization,
            avatar:       user.avatar,
        },
    });
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post(
    '/register',
    authLimiter,
    [
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
                details: errors.array(),
            });
        }

        try {
            const { firstName, lastName, email, password, role, organization } = req.body;

            // Check if user already exists
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }

            const user = await User.create({
                firstName,
                lastName,
                email,
                password,
                role:         role || 'Researcher',
                organization: organization || '',
                isVerified:   true, // Set false + add email verification later if needed
            });

            user.lastLogin = new Date();
            await user.save();
            const { sendWelcomeEmail } = require('../config/mailer');
            // Inside POST /register, after user is created:
            sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err.message));
            console.log(`✅ New user registered: ${email}`);
            return sendToken(res, user, 201);
        } catch (err) {
            console.error('Register error:', err);
            return res.status(500).json({ error: 'Registration failed. Please try again.' });
        }
    }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
    '/login',
    authLimiter,
    [
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }

        try {
            const { email, password } = req.body;

            // Find user and explicitly select password
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            // Google OAuth users have no password
            if (!user.password) {
                return res.status(401).json({
                    error: 'This account uses Google Sign-In. Please use the Google button.',
                });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            if (!user.isActive) {
                return res.status(403).json({ error: 'Your account has been deactivated. Contact support.' });
            }

            user.lastLogin = new Date();
            await user.save();

            console.log(`✅ User logged in: ${email}`);
            return sendToken(res, user);
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Login failed. Please try again.' });
        }
    }
);

// ── POST /api/auth/google ─────────────────────────────────────────────────────
// Frontend sends the Google ID token — we verify and create/login the user
router.post('/google', authLimiter, async (req, res) => {
    try {
        const { googleId, email, firstName, lastName, avatar } = req.body;

        console.log('Google auth attempt:', { googleId, email, firstName, lastName });

        if (!googleId || !email) {
            return res.status(400).json({ error: 'Google auth data missing.' });
        }

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar   = avatar || user.avatar;
                await user.save();
            }
        } else {
            user = await User.create({
                firstName:  firstName || 'User',
                lastName:   lastName  || '',
                email,
                googleId,
                avatar,
                isVerified: true,
                role: 'Researcher',
            });
        }

        user.lastLogin = new Date();
        await user.save();

        console.log(`✅ Google auth success: ${email}`);
        return sendToken(res, user);

    } catch (err) {
        console.error('Google auth error FULL:', err);
        return res.status(500).json({ error: 'Google authentication failed: ' + err.message });
    }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Returns the currently logged-in user (requires token)
router.get('/me', protect, async (req, res) => {
    return res.json({
        success: true,
        user: req.user,
    });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// JWT is stateless — logout is handled client-side by deleting the token
// This endpoint exists for logging purposes
router.post('/logout', protect, async (req, res) => {
    console.log(`👋 User logged out: ${req.user.email}`);
    return res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;