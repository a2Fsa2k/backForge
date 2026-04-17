const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for profile routes.
 */
const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().max(200).optional(),
    phone: Joi.string().allow('', null).max(50).optional(),
    specialty: Joi.string().allow('', null).max(200).optional(),
    bio: Joi.string().allow('', null).max(2000).optional(),
    fee: Joi.number().min(0).max(1000000).optional(),
    license_no: Joi.string().allow('', null).max(100).optional(),
    hospital: Joi.string().allow('', null).max(200).optional(),
    address: Joi.string().allow('', null).max(500).optional()
  }).min(1)
};

const changePasswordSchema = {
  body: Joi.object({
    current_password: Joi.string().min(3).max(128).required(),
    new_password: Joi.string().min(6).max(128).required()
  })
};

module.exports = { updateProfileSchema, changePasswordSchema };
