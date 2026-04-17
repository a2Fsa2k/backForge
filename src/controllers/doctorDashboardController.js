const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const Invoice = require('../models/Invoice');
const { ok, fail } = require('../utils/respond');

function yyyymm(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

async function dashboard(req, res) {
  try {
    const doctorId = req.doctorId;
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = yyyymm(new Date());

    const [
      totalPatients,
      todayAppointments,
      pendingRequests,
      prescriptionsMonth,
      invoicesMonth
    ] = await Promise.all([
      Patient.countDocuments({ doctorId }),
      Appointment.find({ doctorId, date: today }).sort({ time: 1 }).lean(),
      Appointment.countDocuments({ doctorId, status: 'pending' }),
      Prescription.countDocuments({ doctorId, createdAt: { $gte: new Date(`${thisMonth}-01T00:00:00.000Z`) } }),
      Invoice.find({ doctorId, createdAt: { $gte: new Date(`${thisMonth}-01T00:00:00.000Z`) } }).lean()
    ]);

    const revenueMonth = invoicesMonth
      .filter(i => i.status === 'paid')
      .reduce((s, i) => s + (i.amount || 0), 0);

    // recent patients = last appointment within last 30 entries
    const recentAppts = await Appointment.find({ doctorId }).sort({ date: -1, time: -1 }).limit(30).lean();
    const recentPatientIds = [...new Set(recentAppts.map(a => String(a.patientId)))].slice(0, 5);
    const recentPatientsDocs = await Patient.find({ _id: { $in: recentPatientIds }, doctorId }).lean();
    const patientMap = new Map(recentPatientsDocs.map(p => [String(p._id), p]));

    const recent_patients = recentPatientIds
      .map(pid => patientMap.get(pid))
      .filter(Boolean)
      .map(p => ({ id: p._id, name: p.name, age: p.age || null, last_visit: null }));

    return ok(res, {
      stats: {
        today_appointments: todayAppointments.length,
        total_patients: totalPatients,
        pending_requests: pendingRequests,
        prescriptions_month: prescriptionsMonth,
        revenue_month: revenueMonth
      },
      today_appointments: todayAppointments.map(a => ({
        id: a._id,
        time: a.time,
        patient_name: a.patient_name,
        type: a.reason || 'Consultation',
        consultation_type: a.consultation_type,
        status: a.status
      })),
      recent_patients,
      pending_lab_orders: []
    });
  } catch (err) {
    return fail(res, err.message || 'Failed to load dashboard', 500);
  }
}

module.exports = { dashboard };
