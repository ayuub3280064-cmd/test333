const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

async function enrollStudent(req, res, next) {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // create enrollment if not exists
    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user._id, course: courseId },
      { $setOnInsert: { student: req.user._id, course: courseId } },
      { upsert: true, new: true }
    );
    res.status(201).json(enrollment);
  } catch (err) { next(err); }
}

async function getEnrollmentsForUser(req, res, next) {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
    res.json(enrollments);
  } catch (err) { next(err); }
}

async function markLessonComplete(req, res, next) {
  try {
    const { enrollmentId } = req.params;
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (String(enrollment.student) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (!enrollment.progress.includes(lessonId)) {
      enrollment.progress.push(lessonId);
      await enrollment.save();
    }
    res.json(enrollment);
  } catch (err) { next(err); }
}

module.exports = { enrollStudent, getEnrollmentsForUser, markLessonComplete };
