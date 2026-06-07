const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOption: Number,
    score: Number
  }],
  totalScore: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  interpretation: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'],
    required: true
  },
  aiAnalysis: {
    type: String,
    default: 'Analysis pending or unavailable.'
  },
  timeTaken: {
    type: Number,
    default: 0 // in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
resultSchema.index({ user: 1, test: 1 });
resultSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('Result', resultSchema);
