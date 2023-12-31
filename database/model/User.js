const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: Number,
        default: null,
        trim: true
    },
    address: {
        type: String,
        default: null,
        trim: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    resetToken: {
        type: String,
        default: null
    },

    expireToken: {
        type: Date,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },



}, { timestamps: true });

const User = mongoose.model('User', UserSchema) || mongoose.models.User;
module.exports = User;