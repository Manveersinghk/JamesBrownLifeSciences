const router  = require('express').Router();
const Order   = require('../models/Order');
const OTP     = require('../models/OTP');
const { protect } = require('../middleware/authMiddleware');
const { sendOrderNotification } = require('../config/mailer');
const rateLimit = require('express-rate-limit');

const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: 'Too many orders. Please try again later.' },
});

// ── POST /api/orders — place a new order ──────────────────────────────────────
router.post('/', protect, orderLimiter, async (req, res) => {
    const { phone, address, items, notes } = req.body;

    // ── Validate inputs ───────────────────────────────────────────────────────
    if (!phone || !address || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Phone, address, and at least one medicine are required.' });
    }

    const cleanPhone = phone.replace(/\s/g, '');

    // ── Verify OTP was completed for this phone ───────────────────────────────
    const otpRecord = await OTP.findOne({ phone: cleanPhone, verified: true });
    if (!otpRecord) {
        return res.status(400).json({ error: 'Phone number not verified. Please complete OTP verification.' });
    }

    // ── Validate address ──────────────────────────────────────────────────────
    const { line1, city, state, pincode, country } = address;
    if (!line1 || !city || !state || !pincode) {
        return res.status(400).json({ error: 'Please provide complete delivery address.' });
    }

    // ── Validate & calculate order items ─────────────────────────────────────
    for (const item of items) {
        if (!item.medicineId || !item.medicineName || !item.quantity || !item.pricePerUnit) {
            return res.status(400).json({ error: 'Invalid order item data.' });
        }
        if (item.quantity < 1 || item.quantity > 10000) {
            return res.status(400).json({ error: `Invalid quantity for ${item.medicineName}.` });
        }
    }

    const processedItems = items.map((item) => ({
        medicineId:   item.medicineId,
        medicineName: item.medicineName,
        category:     item.category,
        dosageForm:   item.dosageForm || '',
        packSize:     item.packSize || '',
        pricePerUnit: parseFloat(item.pricePerUnit),
        quantity:     parseInt(item.quantity),
        subtotal:     parseFloat(item.pricePerUnit) * parseInt(item.quantity),
    }));

    const totalAmount = processedItems.reduce((sum, i) => sum + i.subtotal, 0);

    try {
        const order = await Order.create({
            userId:        req.user._id,
            customerName:  `${req.user.firstName} ${req.user.lastName}`,
            email:         req.user.email,
            phone:         cleanPhone,
            phoneVerified: true,
            address: { line1, line2: address.line2 || '', city, state, pincode, country: country || 'India' },
            items:         processedItems,
            totalAmount,
            notes:         notes || '',
            ipAddress:     req.ip,
        });

        // Delete the used OTP
        await OTP.deleteOne({ phone: cleanPhone, verified: true });

        // Email notification to company
        sendOrderNotification(order).catch((err) =>
            console.error('Order email error:', err.message)
        );

        console.log(`🛒 New order ${order.orderNumber} from ${req.user.email}`);

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: {
                orderNumber:  order.orderNumber,
                totalAmount:  order.totalAmount,
                status:       order.status,
                items:        order.items,
                address:      order.address,
                createdAt:    order.createdAt,
            },
        });

    } catch (err) {
        console.error('Order error:', err);
        return res.status(500).json({ error: 'Failed to place order. Please try again.' });
    }
});

// ── GET /api/orders/my — get logged-in user's orders ─────────────────────────
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('orderNumber status totalAmount items createdAt address');

        return res.json({ success: true, orders });
    } catch (err) {
        console.error('Get orders error:', err);
        return res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// ── GET /api/orders/:orderNumber — get single order ───────────────────────────
router.get('/:orderNumber', protect, async (req, res) => {
    try {
        const order = await Order.findOne({
            orderNumber: req.params.orderNumber,
            userId: req.user._id,      // users can only see their own orders
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        return res.json({ success: true, order });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch order.' });
    }
});

module.exports = router;

// ── GET /api/orders/admin/all — admin sees all orders ─────────────────────────
router.get('/admin/all', protect, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required.' });
    }
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .select('orderNumber status totalAmount items customerName email phone address notes createdAt');
        return res.json({ success: true, orders });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// ── PATCH /api/orders/admin/:orderNumber/status — update status ───────────────
router.patch('/admin/:orderNumber/status', protect, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required.' });
    }
    const { status } = req.body;
    const validStatuses = ['pending','confirmed','processing','dispatched','delivered','cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
    }
    try {
        const order = await Order.findOneAndUpdate(
            { orderNumber: req.params.orderNumber },
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        console.log(`📦 Order ${order.orderNumber} → ${status} by ${req.user.email}`);
        return res.json({ success: true, order });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update status.' });
    }
});