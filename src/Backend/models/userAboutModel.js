const mongoose = require('mongoose');

const userAboutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to the User model
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    educationQualification: {
        type: String,
        required: true
    },
    smoking: {
        type: String,
        enum: ['Yes', 'No'],
        required: true
    },
    drinks: {
        type: String,
        enum: ['Yes', 'No'],
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    lookingFor: {
        type: String,
        required: true
    },
    bestAt: {
        type: String,
        required: true
    },
    gamerSubscription: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserAbout', userAboutSchema);
