const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const { ok, fail } = require('../utils/respond');

function computeValidUntil(validDays) {
  const days = Number.isFinite(validDays) ? validDays : parseInt(validDays, 10);
  const d = new Date();
  d.setDate(d.getDate() + (days > 0 ? days : 30));
  return d;
}

async function listPrescriptions(req, res) {
  try {
    const patientId = (req.query.patient_id || '').toString();
    const search = (req.query.search || '').toString().trim();

    const q = { doctorId: req.doctorId };
    if (patientId) q.patientId = patientId;
    if (search) {
      q.$or = [
        { patient_name: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } }
      ];
    }

    const list = await Prescription.find(q).sort({ date: -1 }).lean();
    const out = list.map(rx => ({
      id: rx._id,
      patient_name: rx.patient_name,
      diagnosis: rx.diagnosis,
      medicines: rx.medicines || [],
      date: rx.date,
      valid_until: rx.valid_until,
      status: rx.status
    }));

    return ok(res, { prescriptions: out });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function createPrescription(req, res) {
  try {
    const { patient_id, appointment_id, diagnosis, medicines, instructions, valid_days } = req.body || {};

    if (!patient_id) return fail(res, 'patient_id is required', 400);
    if (!Array.isArray(medicines) || medicines.length === 0) return fail(res, 'At least one medicine is required', 400);
    if (!medicines.some(m => m && m.name)) return fail(res, 'Medicine name is required', 400);

    const patient = await Patient.findOne({ _id: patient_id, doctorId: req.doctorId }).lean();
    if (!patient) return fail(res, 'Patient not found', 404);

    const validUntil = computeValidUntil(parseInt(valid_days, 10) || 30);

    const rx = await Prescription.create({
      doctorId: req.doctorId,
      patientId: patient._id,
      appointmentId: appointment_id || null,
      patient_name: patient.name,
      diagnosis: diagnosis || null,
      medicines: medicines.map(m => ({
        name: m.name,
        dosage: m.dosage || null,
        frequency: m.frequency || 'Once daily',
        duration: m.duration || null
      })),
      instructions: instructions || null,
      valid_until: validUntil,
      status: 'active'
    });

    return ok(res, { id: rx._id, message: 'Created' }, 201);
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function getPrescription(req, res) {
  try {
    const rx = await Prescription.findOne({ _id: req.params.id, doctorId: req.doctorId }).lean();
    if (!rx) return fail(res, 'Prescription not found', 404);

    return ok(res, {
      id: rx._id,
      patient_name: rx.patient_name,
      diagnosis: rx.diagnosis,
      medicines: rx.medicines || [],
      instructions: rx.instructions,
      date: rx.date,
      valid_until: rx.valid_until,
      status: rx.status
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function deletePrescription(req, res) {
  try {
    const rx = await Prescription.findOneAndDelete({ _id: req.params.id, doctorId: req.doctorId });
    if (!rx) return fail(res, 'Prescription not found', 404);
    return ok(res, { message: 'Deleted' });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { listPrescriptions, createPrescription, getPrescription, deletePrescription };
