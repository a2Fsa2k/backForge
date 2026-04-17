const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

async function authRequired(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing token' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.doctorId = payload.doctor_id;

    // Extra safety: ensure doctor still exists
    const exists = await Doctor.exists({ _id: req.doctorId });
    if (!exists) return res.status(401).json({ success: false, message: 'Invalid or expired token' });

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authRequired };
