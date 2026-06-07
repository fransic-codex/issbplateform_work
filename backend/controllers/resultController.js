const Result = require('../models/Result');
const Test = require('../models/Test');
const { calculateScore } = require('../utils/scoringEngine');

// @desc    Submit test result
// @route   POST /api/results
// @access  Private
exports.submitResult = async (req, res) => {
  try {
    const { testId, answers, timeTaken } = req.body;

    // Calculate score
    const scoreData = await calculateScore(testId, answers);

    // Create result
    const result = await Result.create({
      user: req.user.id,
      test: testId,
      answers: scoreData.answers,
      totalScore: scoreData.totalScore,
      maxScore: scoreData.maxScore,
      percentage: scoreData.percentage,
      interpretation: scoreData.interpretation,
      level: scoreData.level,
      aiAnalysis: scoreData.aiAnalysis,
      timeTaken: timeTaken || 0
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all results for a user
// @route   GET /api/results
// @access  Private
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate('test', 'title category')
      .sort({ completedAt: -1 });

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single result
// @route   GET /api/results/:id
// @access  Private
exports.getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('test')
      .populate('user', 'name email');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check if user owns the result or is admin
    if (result.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this result' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get results by test
// @route   GET /api/results/test/:testId
// @access  Private
exports.getResultsByTest = async (req, res) => {
  try {
    const results = await Result.find({ 
      user: req.user.id, 
      test: req.params.testId 
    })
      .populate('test', 'title category')
      .sort({ completedAt: -1 });

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all results (Admin only)
// @route   GET /api/results/all
// @access  Private/Admin
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('test', 'title category')
      .populate('user', 'name email')
      .sort({ completedAt: -1 });

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check if user owns the result or is admin
    if (result.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this result' });
    }

    await Result.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
