const mongoSanitize = require('express-mongo-sanitize');

/**
 * NEW: Request sanitization to prevent NoSQL operator injection.
 * Safe: only removes keys containing "$" or "." from request payloads.
 */
const sanitize = mongoSanitize({ replaceWith: '_' });

module.exports = { sanitize };
