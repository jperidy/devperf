const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    cdmId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref:'User'
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
        default: 'Please enter your comment',
    }
}, {
    timestamps: true,
});

// method to verify password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

// method to execut before any save in database if password is modified
userSchema.pre('save', async function (next) {

    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;