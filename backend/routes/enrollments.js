const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  enrollStudent,
  getEnrollmentsForUser,
  markLessonComplete,
} = require('../controllers/enrollmentController');
const { markComplete: markCompleteSchema } = require('../validation/enrollment');

router.post('/course/:courseId', auth, enrollStudent);
router.get('/me', auth, getEnrollmentsForUser);
router.post('/:enrollmentId/complete', auth, validate(markCompleteSchema), markLessonComplete);

module.exports = router;
