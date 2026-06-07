const express = require('express');
const router = express.Router();
const { createEnrollment, getAllEnrollments, getEnrollmentsByStudent, getEnrollmentsByCourse, updateEnrollment, deleteEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, createEnrollment);
router.get('/', protect, adminOnly, getAllEnrollments);
router.get('/student/:studentId', protect, getEnrollmentsByStudent);
router.get('/course/:courseId', protect, adminOnly, getEnrollmentsByCourse);
router.put('/:id', protect, adminOnly, updateEnrollment);
router.delete('/:id', protect, adminOnly, deleteEnrollment);

module.exports = router;