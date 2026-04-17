const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

async function authRequired(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing token' });
    }

    // Frontend demo bypass sets token to 'demo-token'.
    // For hackathon UX, accept it and map to the seeded demo doctor.
    if (token === 'demo-token') {
      const demo = await Doctor.findOne({ email: 'doctor@demo.com' }).lean();
      if (!demo) return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      req.doctorId = demo._id.toString();
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.doctorId = payload.doctor_id;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authRequired };
