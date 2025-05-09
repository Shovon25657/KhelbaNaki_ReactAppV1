const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  gamingName: {
    type: String,
    default: ""
  },
  age: {
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
    required: true
  },
  gamesPlayed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserGamesPlayed'
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);