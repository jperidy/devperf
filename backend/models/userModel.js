const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    matricule: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    arrival: {
        type: String,
        required: true,
    },
    leaving: {
        type: String,
        required: false,
    },
    seniority: {
        type: String,
        required: false,
    },
    isCDM: {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;