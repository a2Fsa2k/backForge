const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for appointment routes.
 */
const idParam = Joi.object({
  id: Joi.string().length(24).hex().required()
});

const listAppointmentsSchema = {
  query: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional()
  })
};

const updateAppointmentSchema = {
  params: idParam,
  body: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional(),
    notes: Joi.string().allow('', null).max(5000).optional(),
    cancel_reason: Joi.string().allow('', null).max(500).optional(),
    cancelled_by: Joi.string().allow('', null).max(100).optional()
  }).min(1)
};

const rescheduleSchema = {
  params: idParam,
  body: Joi.object({
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    reason: Joi.string().allow('', null).max(500).optional()
  })
};

module.exports = { listAppointmentsSchema, updateAppointmentSchema, rescheduleSchema };
