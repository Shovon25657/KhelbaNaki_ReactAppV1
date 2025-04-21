const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({

    bio: {
        type: String,
        default: ""
    },
    age: {
        type: String,
        default: ""
    },
    gamingName: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);