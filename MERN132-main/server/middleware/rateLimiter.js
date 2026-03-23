const rateLimit = require('express-rate-limit');

// ── General API limiter ────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again in 15 minutes.' },
});

// ── Contact form — strict to prevent spam ─────────────────────────────────────
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,                    // 5 submissions per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many contact submissions. Please try again in an hour.' },
});

// ── Career applications ───────────────────────────────────────────────────────
const careerLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3,                          // 3 applications per IP per day
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many applications submitted. Please try again tomorrow.' },
});

// ── Chat — generous but protected ────────────────────────────────────────────
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,                   // 30 messages per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many chat messages. Please wait a moment.' },
});

module.exports = { apiLimiter, contactLimiter, careerLimiter, chatLimiter };