const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        inquiryType: {
            type: String,
            enum: ['order', 'partner', 'medical', 'regulatory', 'pharmacovig', 'general'],
            required: true,
        },
        firstName:  { type: String, required: true, trim: true, maxlength: 100 },
        lastName:   { type: String, required: true, trim: true, maxlength: 100 },
        email:      { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
        phone:      { type: String, trim: true, maxlength: 30 },
        company:    { type: String, trim: true, maxlength: 200 },
        jobTitle:   { type: String, trim: true, maxlength: 150 },
        country:    { type: String, required: true, trim: true, maxlength: 100 },
        subject:    { type: String, required: true, trim: true, maxlength: 300 },
        message:    { type: String, required: true, trim: true, maxlength: 5000 },
        urgent:     { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['new', 'in_progress', 'resolved', 'spam'],
            default: 'new',
        },
        ipAddress:  { type: String },
    },
    { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);