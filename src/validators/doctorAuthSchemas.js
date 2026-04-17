const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for auth routes.
 */
const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(128).required()
  })
};

module.exports = { loginSchema };
