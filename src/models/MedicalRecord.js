const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },

    // denormalized for list performance
    patient_name: { type: String, required: true },

    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: null },

    file_url: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
