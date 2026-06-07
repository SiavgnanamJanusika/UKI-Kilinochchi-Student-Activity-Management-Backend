const express = require('express');
const router = express.Router();
const { markAttendance, getAllAttendance, getAttendanceById, getAttendanceByStudent, getAttendanceByCourse, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, adminOnly, markAttendance);
router.get('/', protect, adminOnly, getAllAttendance);
router.get('/student/:studentId', protect, getAttendanceByStudent);
router.get('/course/:courseId', protect, adminOnly, getAttendanceByCourse);
router.get('/:id', protect, getAttendanceById);
router.put('/:id', protect, adminOnly, updateAttendance);
router.delete('/:id', protect, adminOnly, deleteAttendance);

module.exports = router;