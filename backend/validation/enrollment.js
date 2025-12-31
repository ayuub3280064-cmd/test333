const Joi = require('joi');

const enroll = Joi.object({}); // enrollment is based on route param courseId

const markComplete = Joi.object({
  lessonId: Joi.string().hex().length(24).required(),
});

module.exports = { enroll, markComplete };
