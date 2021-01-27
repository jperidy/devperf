const mongoose = require('mongoose');

const accessSchema = mongoose.Schema({
    profil: {
        type: String,
        required: true
    },
    level: {type: Number, required: true},
    navbar:{
        staffingrequest:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        editmypxx:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        editmyprofil:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        manageconsultant:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        manageuser:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        manageskills:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        managedeals:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        logout:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
    },
    dashboards:{
        tace:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        consodispo:[{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }]
    },
    pxx: {
        days: [{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        comment: [{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        staffings: [{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
        gotoprofil: [{
            mode: {type: String, required: true, enum: ['no', 'read', 'write']},
            data: {type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
        }],
    },
    api: [{
        name:{type: String, required: true},
        data:{type: String, enum: ['my', 'team', 'department', 'domain', 'all']}
    }]

}, {timestamps: true});

const Access = mongoose.model('Access', accessSchema);

module.exports = Access;