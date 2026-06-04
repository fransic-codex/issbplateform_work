const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Please provide question text']
  },
  questionType: {
    type: String,
    required: [true, 'Please provide question type'],
    enum: ['likert', 'frequency', 'true_false', 'mcq']
  },
  options: [{
    label: String,
    value: Number,
    order: Number
  }],
  correctAnswer: {
    type: Number,
    default: null
  },
  score: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    default: 0
  },
  scenario: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
questionSchema.index({ test: 1, order: 1 });

module.exports = mongoose.model('Question', questionSchema);
