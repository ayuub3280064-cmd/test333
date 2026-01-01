const Course = require('../models/Course');

async function createCourse(req, res, next) {
  try {
    const { title, description, price, level, chapters, image, imageSize } = req.body;
    const course = new Course({ title, description, price, level, instructor: req.user._id });

    // add image if provided (base64)
    if (image) {
      course.image = image;
      if (imageSize) course.imageSize = imageSize;
    }

    // sanitize chapters if provided
    if (Array.isArray(chapters)) {
      course.chapters = chapters.map(ch => ({
        title: ch.title || '',
        description: ch.description || '',
        items: Array.isArray(ch.items) ? ch.items.map(it => ({ type: it.type, title: it.title || '', content: it.content || '' })) : []
      }));
    }
    await course.save();
    res.status(201).json(course);
  } catch (err) { next(err); }
}

async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // allow only instructor(owner) or admin
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { chapters, image, imageSize } = req.body;
    // assign other updatable fields
    const allowed = ['title', 'description', 'price', 'level', 'status'];
    allowed.forEach(k => { if (req.body[k] !== undefined) course[k] = req.body[k]; });

    if (image) {
      course.image = image;
      if (imageSize) course.imageSize = imageSize;
    }

    if (Array.isArray(chapters)) {
      course.chapters = chapters.map(ch => ({
        title: ch.title || '',
        description: ch.description || '',
        items: Array.isArray(ch.items) ? ch.items.map(it => ({ type: it.type, title: it.title || '', content: it.content || '' })) : []
      }));
    }
    await course.save();
    res.json(course);
  } catch (err) { next(err); }
}

async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await course.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}

async function getCourse(req, res, next) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) { next(err); }
}

async function listCourses(req, res, next) {
  try {
    const courses = await Course.find().populate('instructor', 'name emaill');
    res.json(courses);
  } catch (err) { next(err); }
}

async function listCoursesAdmin(req, res, next) {
  try {
    const { status, instructor } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (instructor) filter.instructor = instructor;
    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

async function updateCourseStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['draft', 'published', 'review'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const course = await Course.findByIdAndUpdate(id, { status }, { new: true }).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

module.exports = { createCourse, updateCourse, deleteCourse, getCourse, listCourses, listCoursesAdmin, updateCourseStatus };
