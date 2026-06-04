const express = require('express');
const router = express.Router();
const { 
  getTests, 
  getTest, 
  createTest, 
  updateTest, 
  deleteTest,
  getTestWithQuestions
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getTests)
  .post(protect, authorize('admin'), createTest);

router.route('/:id')
  .get(protect, getTest)
  .put(protect, authorize('admin'), updateTest)
  .delete(protect, authorize('admin'), deleteTest);

router.get('/:id/questions', protect, getTestWithQuestions);

module.exports = router;
