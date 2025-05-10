const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  user: { // The user who is performing the action
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUser: { // The user being liked/disliked
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: { // 'like' or 'dislike'
    type: String,
    required: true,
    enum: ['like', 'dislike']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
interactionSchema.index({ user: 1, targetUser: 1 }, { unique: true });

module.exports = mongoose.model('UserInteraction', interactionSchema);