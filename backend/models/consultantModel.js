const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const consultantSchema = mongoose.Schema({
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
    grade: {
        type: String,
        required: true,
        enum: ['Intern', 'Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner', 'Unknown', 'Commercial', 'Research'],
        default: 'Analyst'
    },
    quality: [
        {
            skill: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill'
            },
            level: {
                type: Number,
                required: true
            }
        }
    ],
    arrival: {
        type: Date,
        required: false,
    },
    valued: {
        type: Date,
        required: false,
    },
    leaving: {
        type: Date,
        required: false,
        default: '2100-01-01'
    },
    practice: {
        type: String,
        required: false
    },
    cdmId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref:'Consultant'
    },
    cdmDelegation: [{ cdmId: {type: mongoose.Schema.Types.ObjectId }, name: {type: String} }],
    isCDM: {
        type: Boolean,
        required: true,
        default: false
    },
    isPartialTime: {
        value: { type: Boolean },
        start: String,
        end: String,
        week: [
            {
                num: Number,
                worked: Number
            }
        ]
    },
    comment: {
        type: String,
    },
    // personalObjectives: {
    //     type: String,
    // },
    talentReviewObjectives: {
        type: String,
    },
    availabilityComment: {
        type: String,
    },
    notProdComment: {
        type: String,
    }
}, {
    timestamps: true,
});

const Consultant = mongoose.model('Consultant', consultantSchema);

module.exports = Consultant;