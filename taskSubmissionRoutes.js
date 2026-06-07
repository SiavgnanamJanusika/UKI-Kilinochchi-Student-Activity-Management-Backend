const express = require('express');
const router = express.Router();
const { createSubmission, getAllSubmissions, getSubmissionsByStudent, getSubmissionsByTask, updateSubmission, deleteSubmission } = require('../controllers/taskSubmissionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, studentOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, studentOnly, createSubmission);
router.get('/', protect, adminOnly, getAllSubmissions);
router.get('/student/:studentId', protect, getSubmissionsByStudent);
router.get('/task/:taskId', protect, adminOnly, getSubmissionsByTask);
router.put('/:id', protect, updateSubmission);
router.delete('/:id', protect, adminOnly, deleteSubmission);

module.exports = router;