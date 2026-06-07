const { pool } = require('../config/db');

const createTask = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, priority, status } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ success: false, message: 'courseId and title are required.' });
    }

    const [course] = await pool.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (course.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (courseId, title, description, dueDate, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
      [courseId, title, description || null, dueDate || null, priority || 'medium', status || 'active']
    );

    const [task] = await pool.query(
      `SELECT t.*, c.courseName FROM tasks t JOIN courses c ON t.courseId = c.id WHERE t.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Task created successfully.', task: task[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      [tasks] = await pool.query(
        `SELECT t.*, c.courseName FROM tasks t JOIN courses c ON t.courseId = c.id ORDER BY t.createdAt DESC`
      );
    } else {

      [tasks] = await pool.query(
        `SELECT t.*, c.courseName FROM tasks t 
         JOIN courses c ON t.courseId = c.id 
         JOIN enrollments e ON t.courseId = e.courseId 
         WHERE e.studentId = ? AND e.status = 'active'
         ORDER BY t.createdAt DESC`,
        [req.user.id]
      );
    }

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const [tasks] = await pool.query(
      `SELECT t.*, c.courseName FROM tasks t JOIN courses c ON t.courseId = c.id WHERE t.id = ?`,
      [req.params.id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task: tasks[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getTasksByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (req.user.role === 'student') {
      const [enrollment] = await pool.query(
        'SELECT id FROM enrollments WHERE studentId = ? AND courseId = ? AND status = "active"',
        [req.user.id, courseId]
      );
      if (enrollment.length === 0) {
        return res.status(403).json({ success: false, message: 'You are not enrolled in this course.' });
      }
    }

    const [tasks] = await pool.query(
      `SELECT t.*, c.courseName FROM tasks t JOIN courses c ON t.courseId = c.id WHERE t.courseId = ? ORDER BY t.createdAt DESC`,
      [courseId]
    );

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await pool.query(
      'UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), dueDate = COALESCE(?, dueDate), priority = COALESCE(?, priority), status = COALESCE(?, status) WHERE id = ?',
      [title || null, description || null, dueDate || null, priority || null, status || null, req.params.id]
    );

    const [updated] = await pool.query(
      `SELECT t.*, c.courseName FROM tasks t JOIN courses c ON t.courseId = c.id WHERE t.id = ?`,
      [req.params.id]
    );

    res.status(200).json({ success: true, message: 'Task updated successfully.', task: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);

    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

module.exports = { createTask, getAllTasks, getTaskById, getTasksByCourse, updateTask, deleteTask };