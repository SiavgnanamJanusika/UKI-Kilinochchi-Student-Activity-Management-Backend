const createCourse = (req, res) => {
  res.json({ message: "Course Created" });
};

const getAllCourses = (req, res) => {
  res.json({ message: "All Courses" });
};

const getCourseById = (req, res) => {
  res.json({
    message: "Course By ID",
    id: req.params.id
  });
};

const updateCourse = (req, res) => {
  res.json({
    message: "Course Updated",
    id: req.params.id
  });
};

const deleteCourse = (req, res) => {
  res.json({
    message: "Course Deleted",
    id: req.params.id
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};