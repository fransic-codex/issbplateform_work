const Test = require('../models/Test');
const Question = require('../models/Question');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true }).sort({ category: 1 });
    res.status(200).json({ success: true, count: tests.length, data: tests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single test
// @route   GET /api/tests/:id
// @access  Private
exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new test
// @route   POST /api/tests
// @access  Private/Admin
exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private/Admin
exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Also delete all questions associated with this test
    await Question.deleteMany({ test: req.params.id });
    
    await Test.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get test with questions
// @route   GET /api/tests/:id/questions
// @access  Private
exports.getTestWithQuestions = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const questions = await Question.find({ test: req.params.id, isActive: true })
      .sort({ order: 1 });

    res.status(200).json({ 
      success: true, 
      data: { 
        test, 
        questions 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
