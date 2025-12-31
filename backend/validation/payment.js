const Joi = require('joi');

const createPayment = Joi.object({
  enrollmentId: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(0).required(),
  provider: Joi.string().optional(),
});

module.exports = { createPayment };
