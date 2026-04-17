const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },

    // denormalized for fast UI lists
    patient_name: { type: String, required: true },
    patient_phone: { type: String, default: null },

    date: { type: String, required: true }, // YYYY-MM-DD (matches frontend)
    time: { type: String, required: true }, // HH:MM
    consultation_type: { type: String, default: 'In-clinic' },
    reason: { type: String, default: null },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },

    notes: { type: String, default: null },
    cancel_reason: { type: String, default: null },
    cancelled_by: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
