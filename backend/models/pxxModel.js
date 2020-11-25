const mongoose = require('mongoose');

const pxxSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    month: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Month'
    },
    prodDay: {
        type: Number,
        required: true,
    },
    notProdDay: {
        type: Number,
        required: true,
    },
    leavingDay: {
        type: Number,
        required: true,
    },
    availableDay: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

const Pxx = mongoose.model('Pxx', pxxSchema);

module.exports = Pxx;