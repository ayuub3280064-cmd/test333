const Joi = require('joi');

const createCourse = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).optional(),
  level: Joi.string().valid('beginner','intermediate','advanced').optional(),
  image: Joi.string().optional(), // base64 encoded image
  imageSize: Joi.number().optional(), // image size in KB
  chapters: Joi.array().items(
    Joi.object({
      title: Joi.string().allow('').optional(),
      description: Joi.string().allow('').optional(),
      items: Joi.array().items(
        Joi.object({
          type: Joi.string().valid('lesson','quiz').required(),
          title: Joi.string().allow('').optional(),
          content: Joi.string().allow('').optional()
        })
      ).optional()
    })
  ).optional(),
});

const updateCourse = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).optional(),
  level: Joi.string().valid('beginner','intermediate','advanced').optional(),
  image: Joi.string().optional(), // base64 encoded image
  imageSize: Joi.number().optional(), // image size in KB
  chapters: Joi.array().items(
    Joi.object({
      title: Joi.string().allow('').optional(),
      description: Joi.string().allow('').optional(),
      items: Joi.array().items(
        Joi.object({
          type: Joi.string().valid('lesson','quiz').required(),
          title: Joi.string().allow('').optional(),
          content: Joi.string().allow('').optional()
        })
      ).optional()
    })
  ).optional(),
});

module.exports = { createCourse, updateCourse };
