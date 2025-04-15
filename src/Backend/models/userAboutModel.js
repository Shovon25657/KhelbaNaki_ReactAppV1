const mongoose = require('mongoose');

const userAboutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    educationQualification: {
        type: String,
        default: ""
    },
    smoking: {
        type: String,
        enum: ['Yes', 'No', ''], // Allow empty string
        default: ""
    },
    drinks: {
        type: String,
        enum: ['Yes', 'No', ''],
        default: ""
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ""
    },
    religion: {
        type: String,
        default: ""
    },
    occupation: {
        type: String,
        default: ""
    },
    lookingFor: {
        type: String,
        default: ""
    },
    bestAt: {
        type: String,
        default: ""
    },
    gamerSubscription: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('UserAbout', userAboutSchema);