const Appointment = require('../models/Appointment');
const { ok, fail } = require('../utils/respond');

async function listAppointments(req, res) {
  try {
    const status = (req.query.status || '').toString();
    const date = (req.query.date || '').toString();

    const q = { doctorId: req.doctorId };
    if (status) q.status = status;
    if (date) q.date = date;

    const appts = await Appointment.find(q).sort({ date: -1, time: -1 }).lean();

    const out = appts.map(a => ({
      id: a._id,
      patient_name: a.patient_name,
      patient_phone: a.patient_phone,
      date: a.date,
      time: a.time,
      consultation_type: a.consultation_type,
      reason: a.reason,
      status: a.status,
      notes: a.notes,
      cancel_reason: a.cancel_reason,
      cancelled_by: a.cancelled_by
    }));

    return ok(res, { appointments: out });
  } catch (err) {
    return fail(res, err.message || 'Failed to load appointments', 500);
  }
}

async function getAppointment(req, res) {
  try {
    const a = await Appointment.findOne({ _id: req.params.id, doctorId: req.doctorId }).lean();
    if (!a) return fail(res, 'Appointment not found', 404);

    return ok(res, {
      id: a._id,
      patient_name: a.patient_name,
      patient_phone: a.patient_phone,
      date: a.date,
      time: a.time,
      consultation_type: a.consultation_type,
      reason: a.reason,
      status: a.status,
      notes: a.notes
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

function isValidTransition(from, to) {
  const allowed = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
  };
  return (allowed[from] || []).includes(to);
}

async function updateAppointment(req, res) {
  try {
    const a = await Appointment.findOne({ _id: req.params.id, doctorId: req.doctorId });
    if (!a) return fail(res, 'Appointment not found', 404);

    const { status, notes } = req.body || {};

    if (typeof notes === 'string') {
      a.notes = notes;
    }

    if (status) {
      const next = String(status);
      if (!isValidTransition(a.status, next)) {
        return fail(res, `Invalid status transition: ${a.status} -> ${next}`, 400);
      }
      a.status = next;
      if (next === 'cancelled') {
        a.cancel_reason = a.cancel_reason || 'Rejected by doctor';
        a.cancelled_by = a.cancelled_by || 'doctor';
      }
    }

    await a.save();

    return ok(res, { message: 'Updated', appointment: { id: a._id, status: a.status, notes: a.notes } });
  } catch (err) {
    return fail(res, err.message || 'Update failed', 500);
  }
}

async function reschedule(req, res) {
  try {
    const a = await Appointment.findOne({ _id: req.params.id, doctorId: req.doctorId });
    if (!a) return fail(res, 'Appointment not found', 404);

    const { date, time, reason } = req.body || {};
    if (!date || !time) return fail(res, 'date and time are required', 400);

    a.date = date;
    a.time = time;
    if (reason) a.reason = reason;

    await a.save();
    return ok(res, { message: 'Rescheduled', appointment: { id: a._id, date: a.date, time: a.time } });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { listAppointments, getAppointment, updateAppointment, reschedule };
