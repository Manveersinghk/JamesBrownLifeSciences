const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
    {
        // Personal info
        firstName:      { type: String, required: true, trim: true, maxlength: 100 },
        lastName:       { type: String, required: true, trim: true, maxlength: 100 },
        email:          { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
        phone:          { type: String, required: true, trim: true, maxlength: 30 },

        // Role details
        position:       { type: String, required: true, trim: true, maxlength: 200 },
        department: {
            type: String,
            enum: ['Quality & Regulatory', 'R&D', 'Medical Affairs', 'Operations', 'Clinical Development', ''],
            default: '',
        },
        experience:     { type: String, trim: true, maxlength: 50 },
        currentCompany: { type: String, trim: true, maxlength: 200 },
        noticePeriod:   { type: String, trim: true, maxlength: 100 },

        // Links
        resumeLink:     { type: String, required: true, trim: true, maxlength: 500 },
        linkedIn:       { type: String, trim: true, maxlength: 500 },
        portfolio:      { type: String, trim: true, maxlength: 500 },

        // Screening questions
        whyUs:          { type: String, required: true, trim: true, maxlength: 3000 },
        rightFit:       { type: String, required: true, trim: true, maxlength: 3000 },

        // Logistics
        relocate:       { type: String, trim: true, maxlength: 100 },
        workAuth:       { type: String, trim: true, maxlength: 100 },
        referral:       { type: String, trim: true, maxlength: 100 },

        // Internal tracking
        status: {
            type: String,
            enum: ['new', 'under_review', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn'],
            default: 'new',
        },
        notes:          { type: String, maxlength: 2000 },
        ipAddress:      { type: String },
    },
    { timestamps: true }
);

careerSchema.index({ createdAt: -1 });
careerSchema.index({ email: 1 });
careerSchema.index({ status: 1 });
careerSchema.index({ department: 1 });

module.exports = mongoose.model('Career', careerSchema);