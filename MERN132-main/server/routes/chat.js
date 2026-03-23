const router = require('express').Router();
const { chatLimiter } = require('../middleware/rateLimiter');
const { chatRules, validate } = require('../middleware/validators');

// The chatbot now calls Gemini directly from the React frontend (client-side).
// This route is kept as a fallback proxy in case you want to hide the
// Gemini API key server-side in the future.

// POST /api/chat  (optional server-side proxy)
router.post('/', chatLimiter, chatRules, validate, async (req, res) => {
    const { message } = req.body;

    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
        // Frontend is calling Gemini directly — this route is not needed
        return res.status(501).json({
            error: 'Chat is handled client-side. No server proxy configured.',
        });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: message }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
                }),
            }
        );

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
            ?? 'Sorry, I could not generate a response.';

        return res.json({ response: reply });
    } catch (err) {
        console.error('Chat proxy error:', err);
        return res.status(500).json({ error: 'Chat service unavailable.' });
    }
});

module.exports = router;