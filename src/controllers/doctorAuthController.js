const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Doctor = require('../models/Doctor');
const { ok, fail } = require('../utils/respond');

function signToken(doctor) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ doctor_id: doctor._id.toString(), role: doctor.role || 'user' }, secret, { expiresIn: '7d' });
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return fail(res, 'Email and password are required', 400);

    const doctor = await Doctor.findOne({ email: String(email).toLowerCase().trim() }).select('+passwordHash');
    if (!doctor) return fail(res, 'Invalid credentials', 401);

    const match = await bcrypt.compare(password, doctor.passwordHash);
    if (!match) return fail(res, 'Invalid credentials', 401);

    const token = signToken(doctor);
    const payload = {
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty || null,
        role: doctor.role || 'user'
      }
    };

    // ok() will also spread token/doctor to top-level
    return ok(res, payload);
  } catch (err) {
    return fail(res, err.message || 'Login failed', 500);
  }
}

async function me(req, res) {
  try {
    const doctor = await Doctor.findById(req.doctorId);
    if (!doctor) return fail(res, 'Doctor not found', 404);
    return ok(res, {
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty || null,
        role: doctor.role || 'user'
      }
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function logout(req, res) {
  // Stateless JWT: nothing to revoke in this minimal backend.
  return ok(res, { message: 'Logged out' });
}

module.exports = { login, me, logout };
