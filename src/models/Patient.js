const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, default: null, trim: true },
    phone: { type: String, default: null, trim: true },

    age: { type: Number, default: null },
    gender: { type: String, default: null },
    blood_group: { type: String, default: null },
    weight: { type: Number, default: null },

    allergies: { type: String, default: null },
    conditions: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
