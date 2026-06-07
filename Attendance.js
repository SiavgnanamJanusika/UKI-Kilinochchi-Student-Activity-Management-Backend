const db = require('../config/db');

const Attendance = {
  
  create: (data, callback) => {
    const sql = `
      INSERT INTO attendance (student_id, course_id, date, status, remarks)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.student_id,
        data.course_id,
        data.date,
        data.status,
        data.remarks
      ],
      callback
    );
  },


  getAll: (callback) => {
    const sql = "SELECT * FROM attendance";
    db.query(sql, callback);
  },


  getById: (id, callback) => {
    const sql = "SELECT * FROM attendance WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getByStudent: (studentId, callback) => {
    const sql = "SELECT * FROM attendance WHERE student_id = ?";
    db.query(sql, [studentId], callback);
  },


  getByCourse: (courseId, callback) => {
    const sql = "SELECT * FROM attendance WHERE course_id = ?";
    db.query(sql, [courseId], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE attendance
      SET student_id=?, course_id=?, date=?, status=?, remarks=?
      WHERE id=?
    `;

    db.query(
      sql,
      [
        data.student_id,
        data.course_id,
        data.date,
        data.status,
        data.remarks,
        id
      ],
      callback
    );
  },


  delete: (id, callback) => {
    const sql = "DELETE FROM attendance WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

module.exports = Attendance;