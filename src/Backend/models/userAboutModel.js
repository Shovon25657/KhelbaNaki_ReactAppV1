const mongoose = require('mongoose');

const userAboutSchema = new mongoose.Schema({

    educationQualification: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    smoking: {
        type: String,
        default: ""
    },
    drinks: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserAbout', userAboutSchema);