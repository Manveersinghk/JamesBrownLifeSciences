const router = require('express').Router();
const Career = require('../models/Career');
const { careerLimiter } = require('../middleware/rateLimiter');
const { careerRules, validate } = require('../middleware/validators');
const { sendCareerNotification } = require('../config/mailer');

// POST /api/careers
router.post(
    '/',
    careerLimiter,
    careerRules,
    validate,
    async (req, res) => {
        try {
            const {
                firstName, lastName, email, phone,
                position, department, experience, currentCompany, noticePeriod,
                resumeLink, linkedIn, portfolio,
                whyUs, rightFit,
                relocate, workAuth, referral,
            } = req.body;

            const newApplication = new Career({
                firstName, lastName, email, phone,
                position, department, experience, currentCompany, noticePeriod,
                resumeLink, linkedIn, portfolio,
                whyUs, rightFit,
                relocate, workAuth, referral,
                ipAddress: req.ip,
            });

            const saved = await newApplication.save();

            // Fire-and-forget email
            sendCareerNotification(saved).catch((err) =>
                console.error('Career email error:', err.message)
            );

            return res.status(201).json({
                success: true,
                message: 'Application received. You will hear from us within 5–7 business days.',
                id: saved._id,
            });
        } catch (err) {
            console.error('Career route error:', err);
            return res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
);

module.exports = router;