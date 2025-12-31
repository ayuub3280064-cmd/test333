const Joi = require('joi');

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});

module.exports = { updateProfile };
