const { pool } = require('../config/db');

const markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status, remarks } = req.body;

    if (!studentId || !courseId || !date || !status) {
      return res.status(400).json({ success: false, message: 'studentId, courseId, date and status are required.' });
    }

    const [enrollment] = await pool.query(
      'SELECT id FROM enrollments WHERE studentId = ? AND courseId = ?',
      [studentId, courseId]
    );
    if (enrollment.length === 0) {
      return res.status(400).json({ success: false, message: 'Student is not enrolled in this course.' });
    }

    const [result] = await pool.query(
      'INSERT INTO attendance (studentId, courseId, date, status, remarks) VALUES (?, ?, ?, ?, ?)',
      [studentId, courseId, date, status, remarks || null]
    );

    const [record] = await pool.query(
      `SELECT a.*, u.name AS studentName, c.courseName 
       FROM attendance a
       JOIN users u ON a.studentId = u.id
       JOIN courses c ON a.courseId = c.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Attendance marked successfully.', attendance: record[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const [records] = await pool.query(
      `SELECT a.*, u.name AS studentName, u.email AS studentEmail, c.courseName 
       FROM attendance a
       JOIN users u ON a.studentId = u.id
       JOIN courses c ON a.courseId = c.id
       ORDER BY a.date DESC`
    );
    res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const [records] = await pool.query(
      `SELECT a.*, u.name AS studentName, c.courseName 
       FROM attendance a
       JOIN users u ON a.studentId = u.id
       JOIN courses c ON a.courseId = c.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (records.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    res.status(200).json({ success: true, attendance: records[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === 'student' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const [records] = await pool.query(
      `SELECT a.*, u.name AS studentName, c.courseName 
       FROM attendance a
       JOIN users u ON a.studentId = u.id
       JOIN courses c ON a.courseId = c.id
       WHERE a.studentId = ?
       ORDER BY a.date DESC`,
      [studentId]
    );

    res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getAttendanceByCourse = async (req, res) => {
  try {
    const [records] = await pool.query(
      `SELECT a.*, u.name AS studentName, u.email AS studentEmail, c.courseName 
       FROM attendance a
       JOIN users u ON a.studentId = u.id
       JOIN courses c ON a.courseId = c.id
       WHERE a.courseId = ?
       ORDER BY a.date DESC`,
      [req.params.courseId]
    );

    res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const [existing] = await pool.query('SELECT id FROM attendance WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    await pool.query(
      'UPDATE attendance SET status = COALESCE(?, status), remarks = COALESCE(?, remarks) WHERE id = ?',
      [status || null, remarks || null, req.params.id]
    );

    const [updated] = await pool.query(
      `SELECT a.*, u.name AS studentName, c.courseName 
       FROM attendance a
       JOIN users u ON a.studentId = u.id
       JOIN courses c ON a.courseId = c.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    res.status(200).json({ success: true, message: 'Attendance updated successfully.', attendance: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM attendance WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    await pool.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);

    res.status(200).json({ success: true, message: 'Attendance record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

module.exports = { markAttendance, getAllAttendance, getAttendanceById, getAttendanceByStudent, getAttendanceByCourse, updateAttendance, deleteAttendance };