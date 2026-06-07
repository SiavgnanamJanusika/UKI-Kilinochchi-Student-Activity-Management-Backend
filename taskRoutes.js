const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, getTaskById, getTasksByCourse, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, adminOnly, createTask);
router.get('/', protect, getAllTasks);
router.get('/course/:courseId', protect, getTasksByCourse);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, adminOnly, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);

module.exports = router;