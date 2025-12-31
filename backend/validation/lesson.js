const Joi = require('joi');

const createLesson = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow('').optional(),
  order: Joi.number().integer().min(0).optional(),
});

const updateLesson = Joi.object({
  title: Joi.string().min(1).optional(),
  content: Joi.string().allow('').optional(),
  order: Joi.number().integer().min(0).optional(),
});

module.exports = { createLesson, updateLesson };
