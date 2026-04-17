const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },

    role: { type: String, enum: ['user', 'admin', 'demo'], default: 'user', index: true },

    specialty: { type: String, default: null },
    phone: { type: String, default: null },
    hospital: { type: String, default: null },
    address: { type: String, default: null },

    license_no: { type: String, default: null },
    experience: { type: Number, default: null },
    fee: { type: Number, default: null },
    languages: { type: String, default: null },
    qualifications: { type: String, default: null },
    bio: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
