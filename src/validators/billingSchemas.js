const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for billing routes.
 */
const idParam = Joi.object({
  id: Joi.string().length(24).hex().required()
});

const listBillingSchema = {
  query: Joi.object({
    status: Joi.string().valid('pending', 'paid', 'overdue', '').optional(),
    patient_id: Joi.string().length(24).hex().optional()
  })
};

const itemSchema = Joi.object({
  name: Joi.string().max(200).required(),
  qty: Joi.number().integer().min(1).max(999).optional(),
  amount: Joi.number().min(0).required()
});

const createInvoiceSchema = {
  body: Joi.object({
    patient_id: Joi.string().length(24).hex().required(),
    appointment_id: Joi.string().length(24).hex().allow(null, '').optional(),
    items: Joi.array().items(itemSchema).min(1).required(),
    due_date: Joi.string().allow('', null).optional()
  })
};

const updateInvoiceStatusSchema = {
  params: idParam,
  body: Joi.object({
    status: Joi.string().valid('pending', 'paid', 'overdue').required()
  })
};

const getInvoiceSchema = { params: idParam };

module.exports = { listBillingSchema, createInvoiceSchema, updateInvoiceStatusSchema, getInvoiceSchema };
