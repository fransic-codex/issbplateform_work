const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a test title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a test description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Self Confidence',
      'Influencing Ability',
      'Persuasion Skills',
      'Assertiveness',
      'Bridging Ability',
      'Self Motivation',
      'Communication Skills',
      'Courage',
      'Self Determination',
      'Self Efficacy',
      'Positive Thinking',
      'Responsibility'
    ]
  },
  duration: {
    type: Number,
    default: 0 // 0 means no time limit
  },
  questionCount: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 100
  },
  scoringType: {
    type: String,
    enum: ['sum', 'average', 'weighted'],
    default: 'sum'
  },
  instructions: {
    type: String,
    default: 'Answer all questions honestly. There are no right or wrong answers.'
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

testSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Test', testSchema);
