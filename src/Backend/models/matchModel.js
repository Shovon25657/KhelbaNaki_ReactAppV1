const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchedAt: {
    type: Date,
    default: Date.now
  },
  // You can add additional fields like:
  lastMessage: String,
  lastMessageAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index to ensure unique pairs and faster queries
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);