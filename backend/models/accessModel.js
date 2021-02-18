const mongoose = require('mongoose');

const accessSchema = mongoose.Schema({
    profil: {
        type: String,
        required: true
    },
    level: {type: Number, required: true},
    frontAccess: [{
        category: {type: String, required: true},
        id: {type: String, required: true, unique: true},
        label: {type: String, required: true},
        mode: {type: String, required:true, enum: ['no', 'yes', 'read', 'write']},
        data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
    }],
    api: [{
        name:{type: String, required: true},
        data:{type: String, enum: ['my', 'team', 'department', 'domain', 'all', 'yes', 'no']}
    }]

}, {timestamps: true});

const Access = mongoose.model('Access', accessSchema);

module.exports = Access;