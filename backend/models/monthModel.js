const mongoose = require('mongoose');

const monthSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    firstDay: {
        type: String,
        required: true,
        unique: true
    },
    days: [
        { 
            num: { type: String, required: true, unique: true },
            type:  { type: String, required: true, default: 'working-day' }
    }
    ]
}, {
    timestamps: true
});

const Month = mongoose.model('Month', monthSchema);

module.exports = Month;