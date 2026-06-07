const db = require("../config/db");

const createUser = (data, callback) => {
  const sql = `
    INSERT INTO users 
    (name, email, password, role, phone, address, batch, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      data.name,
      data.email,
      data.password,
      data.role || "student",
      data.phone,
      data.address,
      data.batch,
      data.status || "active"
    ],
    callback
  );
};

const getAllUsers = (callback) => {
  db.query("SELECT * FROM users", callback);
};

const getUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], callback);
};

const getUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

const updateUser = (id, data, callback) => {
  const sql = `
    UPDATE users 
    SET name=?, email=?, phone=?, address=?, batch=?, status=?, role=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      data.name,
      data.email,
      data.phone,
      data.address,
      data.batch,
      data.status,
      data.role,
      id
    ],
    callback
  );
};

const deleteUser = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
};