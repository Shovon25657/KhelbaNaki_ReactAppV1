const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playedGameName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  levelofGaming: { 
    type: String, 
    required: true,
   
    default: ''
  },
  frequency: { 
    type: String, 
    required: true,
    default: ''
  },
  // Add a field to allow sorting by preference
  preference: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const userGamesPlayedSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // One document per user
  },
  gamesPlayed: [gameSchema]
}, { timestamps: true });



// Method to get top games
userGamesPlayedSchema.methods.getTopGames = function(limit = 3) {
  // Sort by preference (higher is more preferred) and return top N
  return this.gamesPlayed
    .sort((a, b) => b.preference - a.preference)
    .slice(0, limit);
};

module.exports = mongoose.model('UserGamesPlayed', userGamesPlayedSchema);