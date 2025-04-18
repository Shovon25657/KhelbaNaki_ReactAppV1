const mongoose = require('mongoose');

const gamesPlayedSchema = new mongoose.Schema({
    games: {
        type: [String], // This defines an array of strings
        default: []     // Default empty array
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    // Reference to the User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('GamesPlayed', gamesPlayedSchema);