const { pool } = require('../config/db');

const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.role === 'admin' ? req.body.studentId : req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required.' });
    }

    const [course] = await pool.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (course.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM enrollments WHERE studentId = ? AND courseId = ?',
      [studentId, courseId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Student already enrolled in this course.' });
    }

    const [result] = await pool.query(
      'INSERT INTO enrollments (studentId, courseId, enrollmentDate) VALUES (?, ?, CURDATE())',
      [studentId, courseId]
    );

    const [enrollment] = await pool.query(
      `SELECT e.*, u.name AS studentName, c.courseName 
       FROM enrollments e 
       JOIN users u ON e.studentId = u.id 
       JOIN courses c ON e.courseId = c.id 
       WHERE e.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Enrolled successfully.', enrollment: enrollment[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const [enrollments] = await pool.query(
      `SELECT e.*, u.name AS studentName, u.email AS studentEmail, c.courseName 
       FROM enrollments e 
       JOIN users u ON e.studentId = u.id 
       JOIN courses c ON e.courseId = c.id 
       ORDER BY e.createdAt DESC`
    );
    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === 'student' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const [enrollments] = await pool.query(
      `SELECT e.*, u.name AS studentName, c.courseName, c.instructorName, c.duration 
       FROM enrollments e 
       JOIN users u ON e.studentId = u.id 
       JOIN courses c ON e.courseId = c.id 
       WHERE e.studentId = ?
       ORDER BY e.createdAt DESC`,
      [studentId]
    );

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getEnrollmentsByCourse = async (req, res) => {
  try {
    const [enrollments] = await pool.query(
      `SELECT e.*, u.name AS studentName, u.email AS studentEmail, c.courseName 
       FROM enrollments e 
       JOIN users u ON e.studentId = u.id 
       JOIN courses c ON e.courseId = c.id 
       WHERE e.courseId = ?
       ORDER BY e.createdAt DESC`,
      [req.params.courseId]
    );
    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const { status } = req.body;

    const [existing] = await pool.query('SELECT id FROM enrollments WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    await pool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, req.params.id]);

    const [updated] = await pool.query(
      `SELECT e.*, u.name AS studentName, c.courseName 
       FROM enrollments e 
       JOIN users u ON e.studentId = u.id 
       JOIN courses c ON e.courseId = c.id 
       WHERE e.id = ?`,
      [req.params.id]
    );

    res.status(200).json({ success: true, message: 'Enrollment updated.', enrollment: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM enrollments WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    await pool.query('DELETE FROM enrollments WHERE id = ?', [req.params.id]);

    res.status(200).json({ success: true, message: 'Enrollment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

module.exports = { createEnrollment, getAllEnrollments, getEnrollmentsByStudent, getEnrollmentsByCourse, updateEnrollment, deleteEnrollment };