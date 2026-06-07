const { pool } = require('../config/db');

// @POST /api/task-submissions  (Student only)
const createSubmission = async (req, res) => {
  try {
    const { taskId, courseId, submissionText, submissionLink } = req.body;
    const studentId = req.user.id;

    if (!taskId || !courseId) {
      return res.status(400).json({ success: false, message: 'taskId and courseId are required.' });
    }

    // Check enrollment
    const [enrollment] = await pool.query(
      'SELECT id FROM enrollments WHERE studentId = ? AND courseId = ? AND status = "active"',
      [studentId, courseId]
    );
    if (enrollment.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course.' });
    }

    // Check task exists
    const [task] = await pool.query('SELECT id FROM tasks WHERE id = ? AND courseId = ?', [taskId, courseId]);
    if (task.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found in this course.' });
    }

    const [result] = await pool.query(
      'INSERT INTO task_submissions (studentId, taskId, courseId, submissionText, submissionLink) VALUES (?, ?, ?, ?, ?)',
      [studentId, taskId, courseId, submissionText || null, submissionLink || null]
    );

    const [submission] = await pool.query(
      `SELECT ts.*, u.name AS studentName, t.title AS taskTitle, c.courseName 
       FROM task_submissions ts
       JOIN users u ON ts.studentId = u.id
       JOIN tasks t ON ts.taskId = t.id
       JOIN courses c ON ts.courseId = c.id
       WHERE ts.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Task submitted successfully.', submission: submission[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @GET /api/task-submissions  (Admin only)
const getAllSubmissions = async (req, res) => {
  try {
    const [submissions] = await pool.query(
      `SELECT ts.*, u.name AS studentName, u.email AS studentEmail, t.title AS taskTitle, c.courseName 
       FROM task_submissions ts
       JOIN users u ON ts.studentId = u.id
       JOIN tasks t ON ts.taskId = t.id
       JOIN courses c ON ts.courseId = c.id
       ORDER BY ts.createdAt DESC`
    );
    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @GET /api/task-submissions/student/:studentId
const getSubmissionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Students can only view their own submissions
    if (req.user.role === 'student' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const [submissions] = await pool.query(
      `SELECT ts.*, u.name AS studentName, t.title AS taskTitle, c.courseName 
       FROM task_submissions ts
       JOIN users u ON ts.studentId = u.id
       JOIN tasks t ON ts.taskId = t.id
       JOIN courses c ON ts.courseId = c.id
       WHERE ts.studentId = ?
       ORDER BY ts.createdAt DESC`,
      [studentId]
    );

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @GET /api/task-submissions/task/:taskId  (Admin only)
const getSubmissionsByTask = async (req, res) => {
  try {
    const [submissions] = await pool.query(
      `SELECT ts.*, u.name AS studentName, u.email AS studentEmail, t.title AS taskTitle, c.courseName 
       FROM task_submissions ts
       JOIN users u ON ts.studentId = u.id
       JOIN tasks t ON ts.taskId = t.id
       JOIN courses c ON ts.courseId = c.id
       WHERE ts.taskId = ?
       ORDER BY ts.createdAt DESC`,
      [req.params.taskId]
    );
    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @PUT /api/task-submissions/:id  (Admin: update marks/feedback; Student: update submission text)
const updateSubmission = async (req, res) => {
  try {
    const { marks, feedback, resultStatus, submissionText, submissionLink } = req.body;

    const [existing] = await pool.query('SELECT * FROM task_submissions WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    if (req.user.role === 'admin') {
      // Admin updates marks, feedback, resultStatus
      await pool.query(
        'UPDATE task_submissions SET marks = COALESCE(?, marks), feedback = COALESCE(?, feedback), resultStatus = COALESCE(?, resultStatus) WHERE id = ?',
        [marks !== undefined ? marks : null, feedback || null, resultStatus || null, req.params.id]
      );
    } else {
      // Student updates submission content
      if (existing[0].studentId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      await pool.query(
        'UPDATE task_submissions SET submissionText = COALESCE(?, submissionText), submissionLink = COALESCE(?, submissionLink) WHERE id = ?',
        [submissionText || null, submissionLink || null, req.params.id]
      );
    }

    const [updated] = await pool.query(
      `SELECT ts.*, u.name AS studentName, t.title AS taskTitle, c.courseName 
       FROM task_submissions ts
       JOIN users u ON ts.studentId = u.id
       JOIN tasks t ON ts.taskId = t.id
       JOIN courses c ON ts.courseId = c.id
       WHERE ts.id = ?`,
      [req.params.id]
    );

    res.status(200).json({ success: true, message: 'Submission updated successfully.', submission: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @DELETE /api/task-submissions/:id  (Admin only)
const deleteSubmission = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM task_submissions WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    await pool.query('DELETE FROM task_submissions WHERE id = ?', [req.params.id]);

    res.status(200).json({ success: true, message: 'Submission deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

module.exports = { createSubmission, getAllSubmissions, getSubmissionsByStudent, getSubmissionsByTask, updateSubmission, deleteSubmission };