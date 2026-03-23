const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        firstName:    { type: String, required: true, trim: true, maxlength: 100 },
        lastName: { type: String, required: false, trim: true, maxlength: 100, default: '' },
        email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
        password:     { type: String, minlength: 6 }, // null for Google OAuth users
        organization: { type: String, trim: true, maxlength: 200 },
        role: {
            type: String,
            enum: ['Researcher', 'Clinician', 'Lab Technician', 'Student', 'Industry Partner', 'Other'],
            default: 'Researcher',
        },

        // Google OAuth
        googleId:     { type: String, sparse: true },
        avatar:       { type: String },

        // Account status
        isVerified:   { type: Boolean, default: false },
        isActive:     { type: Boolean, default: true },

        lastLogin:    { type: Date },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Never send password in JSON responses
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.googleId;
    return obj;
};

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);