const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv     = require('dotenv');
const path       = require('path');

dotenv.config();

// ── Validate required env vars on startup ─────────────────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'CLIENT_ORIGIN'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`❌  Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const app  = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    'http://localhost:5173',
    'http://localhost:3000',
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error(`CORS: origin ${origin} not allowed`));
        },
        methods: ['GET', 'POST', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── NoSQL injection protection ────────────────────────────────────────────────
app.use(mongoSanitize());

// ── Trust proxy ───────────────────────────────────────────────────────────────
app.set('trust proxy', 1);

// ── Database ──────────────────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    })
    .then(() => console.log('✅  MongoDB connected'))
    .catch((err) => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected — retrying...')
);

// ── API routes ────────────────────────────────────────────────────────────────
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api', apiLimiter);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/careers', require('./routes/career'));
app.use('/api/chat',    require('./routes/chat'));
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/orders',  require('./routes/orders'));
// OTP route removed — phone is validated as 10-digit Indian number on order creation

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV,
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    })
);

// ── Serve React frontend in production ────────────────────────────────────────
if (isProd) {
    const distPath = path.join(__dirname, '../client/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
        res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`🌐  Serving React frontend from ${distPath}`);
}

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    if (err.message && err.message.startsWith('CORS')) {
        return res.status(403).json({ error: err.message });
    }
    console.error('Unhandled error:', err.stack);
    res.status(500).json({
        error: isProd ? 'Something went wrong. Please try again.' : err.message,
    });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔗  Allowed origins: ${allowedOrigins.join(', ')}`);
});