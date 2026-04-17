const Joi = require('joi');

/**
 * NEW: Generic Joi validation middleware.
 * Safe: does not change controller logic or response format.
 * Returns same { success:false, message } style on validation errors.
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      const options = {
        abortEarly: true,
        stripUnknown: true,
        convert: true
      };

      if (schema.body) {
        const { value, error } = schema.body.validate(req.body, options);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        req.body = value;
      }

      if (schema.query) {
        const { value, error } = schema.query.validate(req.query, options);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        req.query = value;
      }

      if (schema.params) {
        const { value, error } = schema.params.validate(req.params, options);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        req.params = value;
      }

      return next();
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }
  };
}

module.exports = { validate, Joi };
