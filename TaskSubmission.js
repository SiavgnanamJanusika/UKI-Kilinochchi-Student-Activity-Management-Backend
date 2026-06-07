const db = require('../config/db'); 

const createTable = `
CREATE TABLE IF NOT EXISTS task_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  taskId INT NOT NULL,
  courseId INT NOT NULL,
  submissionText TEXT,
  submissionLink TEXT,
  submittedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  marks INT DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  resultStatus ENUM('Submitted','Reviewed','Passed','Needs Improvement') DEFAULT 'Submitted',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.execute(createTable);

const TaskSubmission = {
  create: (data) => {
    return db.execute(
      `INSERT INTO task_submissions 
      (studentId, taskId, courseId, submissionText, submissionLink)
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.studentId,
        data.taskId,
        data.courseId,
        data.submissionText,
        data.submissionLink
      ]
    );
  },

  getAll: () => {
    return db.execute("SELECT * FROM task_submissions");
  }
};

module.exports = TaskSubmission;