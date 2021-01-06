const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dealSchema = mongoose.Schema({
    company: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        //enum: ['']
    },
    probability: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    proposalDate: {
        type: Date,
        required: false,
    },
    presentationDate: {
        type: Date,
        required: false
    },
    startDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    mainPractice: {
        type: String,
        required: false
    },
    othersPractices: [{
        type: String,
        required: false
    }],
    location: {
        type: String,
        required: false
    },
    staffingRequest: {
        instructions: {
            type: String,
            required: true
        },
        requestStatus: {
            type: String,
            enum: ['wait', 'staff', 'keep', 'available']
        },
        ressources: [{
            responsability: {
                type: String,
                required: true,
                enum: ['Project director', 'Project manager', 'Consultant', 'Intern']
            },
            grade: {
                type: String,
                required: true,
                enum: ['Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner']
            },
            volume: {
                type: String,
                required: true,
                enum: ['1/5', '2/5', '3/5', '4/5', '5/5']
            },
            duration: {
                type: Number,
                required: false
            }
        }]
    },       
    staffingDecision: [{
        responsability: {
            type: String,
            required: true,
            enum: ['Project director', 'Project manager', 'Consultant', 'Intern']
        },
        grade: {
            type: String,
            required: true,
            enum: ['Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner']
        },
        consultant: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'Consultant'
        },
        priority: {
            type: String,
            required: false,
            enum: ['P1', 'P2', 'P3']
        },
        information: {
            type: String,
            required: false
        }
    }],
}, {
    timestamps: true,
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;