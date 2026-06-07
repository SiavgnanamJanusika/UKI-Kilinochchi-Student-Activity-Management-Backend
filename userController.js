const db = require("../config/db");

// GET ALL USERS
const getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email, phone, address, batch, status, role FROM users";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    res.json(results);
  });
};

// GET USER BY ID
const getUserById = (req, res) => {
  const sql = `
    SELECT id, name, email, phone, address, batch, status, role
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
};

// UPDATE USER
const updateUser = (req, res) => {
  const { name, phone, address, batch, status } = req.body;

  const sql = `
    UPDATE users
    SET name=?, phone=?, address=?, batch=?, status=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, phone, address, batch, status, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully" });
    }
  );
};

// DELETE USER
const deleteUser = (req, res) => {
  db.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    }
  );
};

// LOGIN (OPTIONAL - IMPORTANT FIX)
const loginUser = (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Login success",
      user: results[0]
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
};