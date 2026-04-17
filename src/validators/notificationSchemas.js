const { Joi } = require('../middlewares/validate');

/**
 * NEW: Joi schemas for notification routes.
 */
const idParam = Joi.object({
  id: Joi.string().length(24).hex().required()
});

const markReadSchema = { params: idParam };
const deleteSchema = { params: idParam };

module.exports = { markReadSchema, deleteSchema };
