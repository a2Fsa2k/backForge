const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for patient routes.
 */
const listPatientsSchema = {
  query: Joi.object({
    search: Joi.string().allow('').max(200).optional(),
    sort: Joi.string().valid('recent', 'name_asc', 'name_desc', 'appointments').optional()
  })
};

const getPatientSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required()
  })
};

module.exports = { listPatientsSchema, getPatientSchema };
