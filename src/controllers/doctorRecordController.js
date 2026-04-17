const path = require('path');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const { ok, fail } = require('../utils/respond');

async function listRecords(req, res) {
  try {
    const patientId = (req.query.patient_id || '').toString();
    const type = (req.query.type || '').toString();
    const search = (req.query.search || '').toString().trim();

    const q = { doctorId: req.doctorId };
    if (patientId) q.patientId = patientId;
    if (type) q.type = type;
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { patient_name: { $regex: search, $options: 'i' } }
      ];
    }

    const records = await MedicalRecord.find(q).sort({ date: -1 }).lean();
    return ok(res, {
      records: records.map(r => ({
        id: r._id,
        title: r.title,
        patient_name: r.patient_name,
        type: r.type,
        date: r.date,
        notes: r.notes,
        file_url: r.file_url
      }))
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function uploadRecord(req, res) {
  try {
    const { patient_id, title, type, date, notes } = req.body || {};
    if (!patient_id || !title || !type || !date) return fail(res, 'Fill required fields', 400);

    const patient = await Patient.findOne({ _id: patient_id, doctorId: req.doctorId }).lean();
    if (!patient) return fail(res, 'Patient not found', 404);

    let file_url = null;
    if (req.file) {
      // served by /uploads static
      file_url = `/uploads/${path.basename(req.file.path)}`;
    }

    const rec = await MedicalRecord.create({
      doctorId: req.doctorId,
      patientId: patient._id,
      patient_name: patient.name,
      title,
      type,
      date: new Date(date),
      notes: notes || null,
      file_url
    });

    return ok(res, { id: rec._id, file_url, message: 'Uploaded' }, 201);
  } catch (err) {
    return fail(res, err.message || 'Upload failed', 500);
  }
}

async function getRecord(req, res) {
  try {
    const r = await MedicalRecord.findOne({ _id: req.params.id, doctorId: req.doctorId }).lean();
    if (!r) return fail(res, 'Record not found', 404);
    return ok(res, {
      id: r._id,
      title: r.title,
      patient_name: r.patient_name,
      type: r.type,
      date: r.date,
      notes: r.notes,
      file_url: r.file_url
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function deleteRecord(req, res) {
  try {
    const r = await MedicalRecord.findOneAndDelete({ _id: req.params.id, doctorId: req.doctorId });
    if (!r) return fail(res, 'Record not found', 404);
    return ok(res, { message: 'Deleted' });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { listRecords, uploadRecord, getRecord, deleteRecord };
