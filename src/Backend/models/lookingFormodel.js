const mongoose = require('mongoose');

const userLookingForSchema = new mongoose.Schema({

    availability: {
        type: String,
        default: ""
    },
    playMode: {
        type: String,
        default: ""
    },
    playStyle: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserLookingFor', userLookingForSchema);