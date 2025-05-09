const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playedGameName: { type: String, required: true, trim: true },
  levelofGaming: { 
    type: String, 
    required: true,
   // enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  frequency: { 
    type: String, 
    required: true,
   // enum: ['Rarely', 'Occasionally', 'Frequently', 'Always'],
    default: 'Occasionally'
  }
}, { _id: true }); // Ensure each game has its own ID

const userGamesPlayedSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // One document per user
  },
  gamesPlayed: [gameSchema]
}, { timestamps: true });

module.exports = mongoose.model('UserGamesPlayed', userGamesPlayedSchema);