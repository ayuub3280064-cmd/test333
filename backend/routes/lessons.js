const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
  listLessonsByCourse,
} = require('../controllers/lessonController');
const { createLesson: createLessonSchema, updateLesson: updateLessonSchema } = require('../validation/lesson');

router.get('/course/:courseId', listLessonsByCourse);
router.get('/:id', getLesson);

router.post('/course/:courseId', auth, validate(createLessonSchema), createLesson);
router.put('/:id', auth, validate(updateLessonSchema), updateLesson);
router.delete('/:id', auth, deleteLesson);

module.exports = router;
