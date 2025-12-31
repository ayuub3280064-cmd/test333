const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  listCourses,
  listCoursesAdmin,
  updateCourseStatus,
} = require('../controllers/courseController');
const { createCourse: createCourseSchema, updateCourse: updateCourseSchema } = require('../validation/course');

router.get('/', listCourses);
router.get('/:id', getCourse);

// Admin: list all courses with filters
router.get('/admin/list', auth, permit('admin'), listCoursesAdmin);
// Admin: update course status
router.patch('/:id/status', auth, permit('admin'), updateCourseStatus);

// Protected: only instructors or admins can create courses
router.post('/', auth, permit('instructor'), validate(createCourseSchema), createCourse);
router.put('/:id', auth, validate(updateCourseSchema), updateCourse); // controller checks owner or admin
router.delete('/:id', auth, permit('admin'), deleteCourse);

module.exports = router;
