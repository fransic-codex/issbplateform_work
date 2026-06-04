const express = require('express');
const router = express.Router();
const { 
  getQuestionsByTest, 
  getQuestion, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  bulkCreateQuestions
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

router.route('/test/:testId')
  .get(protect, getQuestionsByTest);

router.route('/')
  .post(protect, authorize('admin'), createQuestion);

router.post('/bulk', protect, authorize('admin'), bulkCreateQuestions);

router.route('/:id')
  .get(protect, getQuestion)
  .put(protect, authorize('admin'), updateQuestion)
  .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;
