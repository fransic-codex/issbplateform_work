const Question = require('../models/Question');

// @desc    Get all questions for a test
// @route   GET /api/questions/test/:testId
// @access  Private
exports.getQuestionsByTest = async (req, res) => {
  try {
    const questions = await Question.find({ 
      test: req.params.testId, 
      isActive: true 
    }).sort({ order: 1 });
    
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    
    // Update test question count
    const Test = require('../models/Test');
    await Test.findByIdAndUpdate(question.test, {
      $inc: { questionCount: 1 }
    });
    
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Update test question count
    const Test = require('../models/Test');
    await Test.findByIdAndUpdate(question.test, {
      $inc: { questionCount: -1 }
    });
    
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private/Admin
exports.bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    const createdQuestions = await Question.insertMany(questions);
    
    // Update test question count
    const Test = require('../models/Test');
    if (createdQuestions.length > 0) {
      await Test.findByIdAndUpdate(createdQuestions[0].test, {
        $inc: { questionCount: createdQuestions.length }
      });
    }
    
    res.status(201).json({ success: true, data: createdQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
