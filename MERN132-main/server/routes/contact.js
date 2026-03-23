const router = require('express').Router();
const Contact = require('../models/Contact');
const { contactLimiter } = require('../middleware/rateLimiter');
const { contactRules, validate } = require('../middleware/validators');
const { sendContactNotification } = require('../config/mailer');

// POST /api/contact
router.post(
    '/',
    contactLimiter,
    contactRules,
    validate,
    async (req, res) => {
        try {
            const {
                inquiryType, firstName, lastName, email, phone,
                company, jobTitle, country, subject, message, urgent,
            } = req.body;

            const newContact = new Contact({
                inquiryType,
                firstName, lastName, email, phone,
                company, jobTitle, country,
                subject, message,
                urgent: urgent === true,
                ipAddress: req.ip,
            });

            const saved = await newContact.save();

            // Fire-and-forget email — don't block the response
            sendContactNotification(saved).catch((err) =>
                console.error('Contact email error:', err.message)
            );

            return res.status(201).json({
                success: true,
                message: 'Your message has been received. We will respond shortly.',
                id: saved._id,
            });
        } catch (err) {
            console.error('Contact route error:', err);
            return res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
);

module.exports = router;