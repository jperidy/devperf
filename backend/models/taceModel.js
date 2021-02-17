const mongoose = require('mongoose');

const taceSchema = mongoose.Schema({
    month: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Month',
        required: true
    },
    practice: {
        type: String
    },
    target: {
        type: Number,
    },
    bid: {
        type: Number,
    }
}, {
    timestamps: true,
});

const Tace = mongoose.model('Tace', taceSchema);

module.exports = Tace;