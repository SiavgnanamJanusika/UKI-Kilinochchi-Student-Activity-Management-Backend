const db = require('../config/db');

const Course = {


  create: (data, callback) => {
    const sql = `
      INSERT INTO courses (name, description)
      VALUES (?, ?)
    `;

    db.query(sql, [data.name, data.description], callback);
  },


  getAll: (callback) => {
    db.query("SELECT * FROM courses", callback);
  },

  
  getById: (id, callback) => {
    db.query("SELECT * FROM courses WHERE id = ?", [id], callback);
  },


  update: (id, data, callback) => {
    const sql = `
      UPDATE courses
      SET name=?, description=?
      WHERE id=?
    `;

    db.query(sql, [data.name, data.description, id], callback);
  },


  delete: (id, callback) => {
    db.query("DELETE FROM courses WHERE id = ?", [id], callback);
  }
};

module.exports = Course;