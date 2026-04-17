const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { ok, fail } = require('../utils/respond');

async function listPatients(req, res) {
  try {
    const search = (req.query.search || '').toString().trim();
    const sort = (req.query.sort || 'recent').toString();

    const q = { doctorId: req.doctorId };
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortSpec = { updatedAt: -1 };
    if (sort === 'name_asc') sortSpec = { name: 1 };
    if (sort === 'name_desc') sortSpec = { name: -1 };

    const patients = await Patient.find(q).sort(sortSpec).lean();

    // Enrich with last_visit and total_visits (from appointments)
    const ids = patients.map(p => p._id);
    const apptAgg = await Appointment.aggregate([
      { $match: { doctorId: req.doctorId, patientId: { $in: ids } } },
      {
        $group: {
          _id: '$patientId',
          total_visits: { $sum: 1 },
          last_visit: { $max: '$date' }
        }
      }
    ]);
    const apptMap = new Map(apptAgg.map(a => [a._id.toString(), a]));

    const out = patients.map(p => {
      const a = apptMap.get(p._id.toString()) || {};
      return {
        id: p._id.toString(),
        name: p.name,
        email: p.email,
        phone: p.phone,
        age: p.age,
        gender: p.gender,
        blood_group: p.blood_group,
        last_visit: a.last_visit || null,
        total_visits: a.total_visits || 0
      };
    });

    // Frontend expects either an array, OR { patients: [...] }.
    // We return { patients } and ok() will include it at top-level as well.
    return ok(res, { patients: out });
  } catch (err) {
    return fail(res, err.message || 'Failed to load patients', 500);
  }
}

async function getPatient(req, res) {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, doctorId: req.doctorId }).lean();
    if (!patient) return fail(res, 'Patient not found', 404);

    const appointments = await Appointment.find({ doctorId: req.doctorId, patientId: patient._id })
      .sort({ date: -1, time: -1 })
      .limit(25)
      .lean();

    // UI expects embedded prescriptions and records arrays; not implemented in Phase 1.
    return ok(res, {
      id: patient._id.toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.blood_group,
      weight: patient.weight,
      allergies: patient.allergies,
      conditions: patient.conditions,
      appointments: appointments.map(a => ({ id: a._id.toString(), date: a.date, time: a.time, status: a.status })),
      prescriptions: [],
      records: []
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { listPatients, getPatient };
