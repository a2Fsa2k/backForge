const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },

    type: {
      type: String,
      enum: ['appointment', 'lab', 'patient', 'billing', 'system'],
      default: 'system',
      index: true
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    is_read: { type: Boolean, default: false, index: true },
    created_at: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Notification', notificationSchema);
