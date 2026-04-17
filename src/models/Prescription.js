const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, default: null },
    frequency: { type: String, required: true },
    duration: { type: String, default: null }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null, index: true },

    // denormalized
    patient_name: { type: String, required: true },

    diagnosis: { type: String, default: null },
    medicines: { type: [medicineSchema], default: [] },
    instructions: { type: String, default: null },

    date: { type: Date, default: Date.now },
    valid_until: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
