const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  gamingName: {
    type: String,
    default: ""
  },
  age: {
    type: Number, // Changed from String to Number for better validation and querying
    default: null
  },
  bio: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensure one profile per user
  },
  // Remove the gamesPlayed array - we'll access through the userId in the games model
}, { timestamps: true });


// Virtual property to access games
userProfileSchema.virtual('gamesPlayed', {
  ref: 'UserGamesPlayed',
  localField: 'user',
  foreignField: 'user',
  justOne: true // Since we have one games document per user
});

module.exports = mongoose.model('UserProfile', userProfileSchema);