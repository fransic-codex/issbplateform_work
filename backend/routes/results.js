const express = require('express');
const router = express.Router();
const { 
  submitResult, 
  getResults, 
  getResult, 
  getResultsByTest,
  getAllResults,
  deleteResult
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getResults)
  .post(protect, submitResult);

router.get('/all', protect, authorize('admin'), getAllResults);
router.get('/test/:testId', protect, getResultsByTest);

router.route('/:id')
  .get(protect, getResult)
  .delete(protect, deleteResult);

module.exports = router;
