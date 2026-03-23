const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    medicineId:   { type: String, required: true },   // hardcoded ID from frontend catalogue
    medicineName: { type: String, required: true },
    category:     { type: String, required: true },
    dosageForm:   { type: String },
    packSize:     { type: String },
    pricePerUnit: { type: Number, required: true },
    quantity:     { type: Number, required: true, min: 1 },
    subtotal:     { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        // Order reference
        orderNumber: { type: String, unique: true },

        // Customer (must be logged in)
        userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        customerName: { type: String, required: true, trim: true },
        email:        { type: String, required: true, trim: true },

        // OTP-verified phone
        phone:        { type: String, required: true },
        phoneVerified:{ type: Boolean, default: false, required: true },

        // Delivery address
        address: {
            line1:    { type: String, required: true, trim: true },
            line2:    { type: String, trim: true },
            city:     { type: String, required: true, trim: true },
            state:    { type: String, required: true, trim: true },
            pincode:  { type: String, required: true, trim: true },
            country:  { type: String, required: true, default: 'India' },
        },

        // Order items
        items:        { type: [orderItemSchema], required: true },
        totalAmount:  { type: Number, required: true },
        currency:     { type: String, default: 'INR' },

        // Special instructions
        notes:        { type: String, maxlength: 500 },

        // Order status — visible to company
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
            default: 'pending',
        },

        // Internal
        ipAddress:    { type: String },
    },
    { timestamps: true }
);

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `JBLS-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);