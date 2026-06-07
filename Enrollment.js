const db = require('../config/db');

const Enrollment = {


  create: (data, callback) => {
    const sql = `
      INSERT INTO enrollments (user_id, course_id)
      VALUES (?, ?)
    `;

    db.query(sql, [data.user_id, data.course_id], callback);
  },

  getAll: (callback) => {
    const sql = `
      SELECT * FROM enrollments
    `;
    db.query(sql, callback);
  },


  getById: (id, callback) => {
    const sql = `
      SELECT * FROM enrollments WHERE id = ?
    `;
    db.query(sql, [id], callback);
  },

  getByUser: (userId, callback) => {
    const sql = `
      SELECT * FROM enrollments WHERE user_id = ?
    `;
    db.query(sql, [userId], callback);
  },

  getByCourse: (courseId, callback) => {
    const sql = `
      SELECT * FROM enrollments WHERE course_id = ?
    `;
    db.query(sql, [courseId], callback);
  },

 
  delete: (id, callback) => {
    const sql = `
      DELETE FROM enrollments WHERE id = ?
    `;
    db.query(sql, [id], callback);
  }
};

module.exports = Enrollment;