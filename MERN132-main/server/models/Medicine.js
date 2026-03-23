const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
    {
        name:        { type: String, required: true, trim: true },
        category: {
            type: String,
            required: true,
            enum: ['cardiovascular', 'oncology', 'anti-infective', 'neurology', 'respiratory', 'paediatric'],
        },
        description: { type: String, trim: true, maxlength: 1000 },
        composition: { type: String, trim: true },       // e.g. "Atorvastatin 10mg"
        dosageForm:  { type: String, trim: true },       // e.g. "Tablet", "Syrup", "Injection"
        packSize:    { type: String, trim: true },       // e.g. "10 tablets/strip"
        pricePerUnit:{ type: Number, required: true },   // price per strip/bottle/vial
        currency:    { type: String, default: 'USD' },
        minOrderQty: { type: Number, default: 1 },
        inStock:     { type: Boolean, default: true },
        image:       { type: String },                   // filename from assets
        tags:        [{ type: String }],
        isActive:    { type: Boolean, default: true },
    },
    { timestamps: true }
);

medicineSchema.index({ category: 1 });
medicineSchema.index({ name: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);