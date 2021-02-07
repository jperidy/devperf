const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    commercialTeam: [{ 
            contactEmail: { type: String, required: true, unique: true },
            contactName:  { type: String }
    }]
}, {
    timestamps: true
});

const Client = mongoose.model('client', clientSchema);

module.exports = Client;