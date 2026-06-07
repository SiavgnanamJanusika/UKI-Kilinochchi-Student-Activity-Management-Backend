const db = require("../config/db");

const createTask = (data, callback) => {
  const sql = `
    INSERT INTO tasks 
    (course_id, title, description, due_date, priority, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    data.courseId,
    data.title,
    data.description,
    data.dueDate,
    data.priority,
    data.status
  ], callback);
};

const getAllTasks = (callback) => {
  db.query("SELECT * FROM tasks", callback);
};

const getTaskById = (id, callback) => {
  db.query("SELECT * FROM tasks WHERE id = ?", [id], callback);
};

const updateTask = (id, data, callback) => {
  const sql = `
    UPDATE tasks 
    SET title=?, description=?, due_date=?, priority=?, status=? 
    WHERE id=?
  `;

  db.query(sql, [
    data.title,
    data.description,
    data.dueDate,
    data.priority,
    data.status,
    id
  ], callback);
};

const deleteTask = (id, callback) => {
  db.query("DELETE FROM tasks WHERE id = ?", [id], callback);
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};