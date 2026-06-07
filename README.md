# 🎓 UKI Kilinochchi - Student Activity Management Backend

A complete REST API backend for managing student activities at UKI Kilinochchi, built with Node.js, Express.js, and MySQL.

---

## 📌 Project Description

This backend system handles student registrations, course management, enrollments, task assignments, task submissions with results, and attendance tracking. It uses JWT-based authentication with role-based access control for Admin and Student roles.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MySQL | Relational database |
| mysql2 | MySQL driver for Node.js |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variables |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## 📁 Folder Structure

```
uki-student-activity-backend/
│
├── config/
│   ├── db.js               # MySQL connection pool
│   └── database.sql        # Database & table creation script
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── enrollmentController.js
│   ├── taskController.js
│   ├── taskSubmissionController.js
│   └── attendanceController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── enrollmentRoutes.js
│   ├── taskRoutes.js
│   ├── taskSubmissionRoutes.js
│   └── attendanceRoutes.js
│
├── middleware/
│   ├── authMiddleware.js   # JWT token verification
│   └── roleMiddleware.js   # Admin / Student role check
│
├── .env                    # Environment variables (not uploaded to GitHub)
├── .gitignore
├── package.json
├── server.js               # App entry point
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/uki-student-activity-backend.git
cd uki-student-activity-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup MySQL Database
Open MySQL and run the setup script:
```bash
mysql -u root -p < config/database.sql
```

### 4. Configure Environment Variables
Create a `.env` file in the root folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=uki_student_db
JWT_SECRET=uki_jwt_super_secret_key_2024
JWT_EXPIRES_IN=7d
```

### 5. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

### Default Admin Account
```
Email:    "  "
Password: "  "
```

---

## 📡 API Endpoints

### 🔐 Authentication  `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new student |
| POST | `/login` | Public | Login & get JWT token |
| GET | `/profile` | Protected | Get logged-in user profile |

### 👤 User Management  `/api/users`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Admin / Own Student | Get user by ID |
| PUT | `/:id` | Admin / Own Student | Update user |
| DELETE | `/:id` | Admin | Delete user |

### 📚 Course Management  `/api/courses`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create course |
| GET | `/` | All | Get all courses |
| GET | `/:id` | All | Get course by ID |
| PUT | `/:id` | Admin | Update course |
| DELETE | `/:id` | Admin | Delete course |

### 📝 Enrollment Management  `/api/enrollments`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Student / Admin | Enroll in a course |
| GET | `/` | Admin | Get all enrollments |
| GET | `/student/:studentId` | Admin / Own Student | Get enrollments by student |
| GET | `/course/:courseId` | Admin | Get enrollments by course |
| PUT | `/:id` | Admin | Update enrollment status |
| DELETE | `/:id` | Admin | Delete enrollment |

### ✅ Task Management  `/api/tasks`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create task |
| GET | `/` | All | Get tasks (students see enrolled only) |
| GET | `/:id` | All | Get task by ID |
| GET | `/course/:courseId` | All | Get tasks by course |
| PUT | `/:id` | Admin | Update task |
| DELETE | `/:id` | Admin | Delete task |

### 📤 Task Submission & Results  `/api/task-submissions`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Student | Submit a task |
| GET | `/` | Admin | Get all submissions |
| GET | `/student/:studentId` | Admin / Own Student | Get submissions by student |
| GET | `/task/:taskId` | Admin | Get submissions by task |
| PUT | `/:id` | Admin / Student | Update submission / marks / feedback |
| DELETE | `/:id` | Admin | Delete submission |

### 📅 Attendance Management  `/api/attendance`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Mark attendance |
| GET | `/` | Admin | Get all attendance |
| GET | `/:id` | All | Get attendance by ID |
| GET | `/student/:studentId` | Admin / Own Student | Get attendance by student |
| GET | `/course/:courseId` | Admin | Get attendance by course |
| PUT | `/:id` | Admin | Update attendance |
| DELETE | `/:id` | Admin | Delete attendance |

---

## 🧪 Postman Testing Flow

Test in this order for full real-time flow:

```
1.  POST /api/auth/register         → Register student
2.  POST /api/auth/login            → Login as student (save token)
3.  POST /api/auth/login            → Login as admin (save token)
4.  POST /api/courses               → Admin creates course
5.  GET  /api/courses               → Student views courses
6.  POST /api/enrollments           → Student enrolls in course
7.  POST /api/tasks                 → Admin creates task for course
8.  GET  /api/tasks                 → Student views enrolled tasks
9.  POST /api/task-submissions      → Student submits task
10. GET  /api/task-submissions      → Admin views submissions
11. PUT  /api/task-submissions/:id  → Admin updates marks & result
12. GET  /api/task-submissions/student/:id → Student views result
13. POST /api/attendance            → Admin marks attendance
14. GET  /api/attendance/student/:id → Student views attendance
```

### How to use JWT in Postman
```
Headers:
  Authorization: Bearer <your_token_here>
  Content-Type: application/json
```

---

## 🌿 Git Branch Workflow

```bash
main                      # Production-ready code
auth-schema               # Authentication module
user-schema               # User management module
course-schema             # Course management module
enrollment-schema         # Enrollment module
task-schema               # Task module
task-submission-schema    # Task submission & result module
attendance-schema         # Attendance module
```

### Branch commands used:
```bash
git checkout -b auth-schema
# ... develop and test ...
git add .
git commit -m "feat: add authentication module"
git checkout main
git merge auth-schema
```

---

## 🏗️ Architecture Overview

```
Request → Routes → Middleware (JWT + Role) → Controller → MySQL → Response
```

- **Routes** define the URL paths and HTTP methods
- **authMiddleware** verifies the JWT token on protected routes
- **roleMiddleware** checks if user is admin or student
- **Controllers** contain business logic and SQL queries
- **mysql2** pool executes queries against MySQL database

---

## 🔒 Security Features

- Passwords hashed using **bcryptjs** (10 salt rounds)
- **JWT tokens** expire in 7 days
- `.env` file excluded from GitHub via `.gitignore`
- Role-based access: admin-only routes protected by `adminOnly` middleware
- Students can only access their own data

---

## 🗄️ Database Tables

| Table | Description |
|---|---|
| users | Students and admin accounts |
| courses | Available courses |
| enrollments | Student-course enrollment records |
| tasks | Tasks assigned to courses |
| task_submissions | Student task submissions and results |
| attendance | Student attendance records |

---

## 👨‍💻 Developer

**Student Name:** [Janushika Sivagnanam]  
**Institution:** UKI Kilinochchi  
**Assignment:** Backend Development — Student Activity Management System  
