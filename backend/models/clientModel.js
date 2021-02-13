const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    //commercialTeam: {type: Array}
    commercialTeam: [{ 
        contactEmail: { type: String, required: true, unique: false },
        contactName:  { type: String, unique:false }
    }]
}, {
    timestamps: true
});

const Client = mongoose.model('client', clientSchema);

module.exports = Client;