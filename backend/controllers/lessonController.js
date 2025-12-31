const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

async function createLesson(req, res, next) {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // only instructor or admin
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { title, content, order } = req.body;
    const lesson = new Lesson({ course: courseId, title, content, order });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) { next(err); }
}

async function updateLesson(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (String(lesson.course.instructor) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    Object.assign(lesson, req.body);
    await lesson.save();
    res.json(lesson);
  } catch (err) { next(err); }
}

async function deleteLesson(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (String(lesson.course.instructor) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await lesson.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}

async function getLesson(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) { next(err); }
}

async function listLessonsByCourse(req, res, next) {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ course: courseId }).sort('order');
    res.json(lessons);
  } catch (err) { next(err); }
}

module.exports = { createLesson, updateLesson, deleteLesson, getLesson, listLessonsByCourse };
