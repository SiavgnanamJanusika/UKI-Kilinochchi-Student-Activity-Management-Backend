const express = require('express');
const router = express.Router();
const { 
    createCourse , 
    getAllCourses , 
    getCourseById , 
    updateCourse , 
    deleteCourse 
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, adminOnly,createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;


