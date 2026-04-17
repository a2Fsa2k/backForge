const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    qty: { type: Number, default: 1 },
    amount: { type: Number, required: true }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null, index: true },

    // denormalized
    patient_name: { type: String, required: true },

    invoice_no: { type: String, default: null, index: true },

    items: { type: [itemSchema], default: [] },
    tax_percent: { type: Number, default: 0 },
    notes: { type: String, default: null },

    amount: { type: Number, required: true },
    due_date: { type: Date, default: null },
    date: { type: Date, default: Date.now },

    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
