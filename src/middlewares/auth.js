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
    req.userRole = payload.role || 'user';

    // Extra safety: ensure doctor still exists
    const exists = await Doctor.exists({ _id: req.doctorId });
    if (!exists) return res.status(401).json({ success: false, message: 'Invalid or expired token' });

    // Optional: backfill role from DB if older tokens didn't include it
    if (!payload.role) {
      const d = await Doctor.findById(req.doctorId).select('role').lean();
      req.userRole = d?.role || 'user';
    }

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authRequired };
