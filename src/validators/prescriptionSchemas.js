const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for prescription routes.
 */
const idParam = Joi.object({
  id: Joi.string().length(24).hex().required()
});

const listPrescriptionsSchema = {
  query: Joi.object({
    patient_id: Joi.string().length(24).hex().optional(),
    search: Joi.string().allow('').max(200).optional()
  })
};

const medicineSchema = Joi.object({
  name: Joi.string().max(200).required(),
  dosage: Joi.string().allow('', null).max(100).optional(),
  frequency: Joi.string().max(100).required(),
  duration: Joi.string().allow('', null).max(100).optional()
});

const createPrescriptionSchema = {
  body: Joi.object({
    patient_id: Joi.string().length(24).hex().required(),
    appointment_id: Joi.string().length(24).hex().allow(null, '').optional(),
    diagnosis: Joi.string().allow('', null).max(500).optional(),
    medicines: Joi.array().items(medicineSchema).min(1).required(),
    instructions: Joi.string().allow('', null).max(2000).optional(),
    valid_days: Joi.number().integer().min(1).max(365).optional()
  })
};

const updatePrescriptionSchema = {
  params: idParam,
  body: Joi.object({
    diagnosis: Joi.string().allow('', null).max(500).optional(),
    medicines: Joi.array().items(medicineSchema).min(1).optional(),
    instructions: Joi.string().allow('', null).max(2000).optional(),
    valid_days: Joi.number().integer().min(1).max(365).optional(),
    status: Joi.string().valid('active', 'expired').optional()
  }).min(1)
};

const getPrescriptionSchema = { params: idParam };
const deletePrescriptionSchema = { params: idParam };

module.exports = {
  listPrescriptionsSchema,
  createPrescriptionSchema,
  updatePrescriptionSchema,
  getPrescriptionSchema,
  deletePrescriptionSchema
};
