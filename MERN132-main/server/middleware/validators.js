const { body, validationResult } = require('express-validator');

// ── Reusable error handler ────────────────────────────────────────────────────
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: 'Validation failed',
            details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

// ── Contact rules ─────────────────────────────────────────────────────────────
const contactRules = [
    body('inquiryType')
        .isIn(['order', 'partner', 'medical', 'regulatory', 'pharmacovig', 'general'])
        .withMessage('Invalid enquiry type'),
    body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 100 }),
    body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 30 }),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 300 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
    body('urgent').optional().isBoolean(),
];

// ── Career rules ──────────────────────────────────────────────────────────────
const careerRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 100 }),
    body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 30 }),
    body('position').trim().notEmpty().withMessage('Position is required').isLength({ max: 200 }),
    body('experience').optional().trim().isLength({ max: 50 }),
    body('resumeLink').trim().notEmpty().withMessage('Resume link is required').isURL().withMessage('Must be a valid URL'),
    body('linkedIn').optional({ checkFalsy: true }).trim().isURL().withMessage('LinkedIn must be a valid URL'),
    body('portfolio').optional({ checkFalsy: true }).trim().isURL().withMessage('Portfolio must be a valid URL'),
    body('whyUs').trim().notEmpty().withMessage('Please tell us why you want to join').isLength({ max: 3000 }),
    body('rightFit').trim().notEmpty().withMessage('Please share a key achievement').isLength({ max: 3000 }),
];

// ── Chat rules ────────────────────────────────────────────────────────────────
const chatRules = [
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }),
];

module.exports = { validate, contactRules, careerRules, chatRules };