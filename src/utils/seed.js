const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');

async function resetSeedData() {
  // Fully wipe the current database (all collections) then re-seed.
  // WARNING: This deletes EVERYTHING in the DB pointed to by MONGO_URI.
  const db = mongoose.connection?.db;
  if (!db) throw new Error('MongoDB not connected');

  const cols = await db.listCollections().toArray();
  await Promise.all(
    cols
      .map(c => c.name)
      .filter(name => name && !name.startsWith('system.'))
      .map(name => db.collection(name).deleteMany({}))
  );
}

async function ensureSeedData() {
  // Demo doctor (matches frontend demo user identity)
  const demoEmail = 'doctor@demo.com';
  let doctor = await Doctor.findOne({ email: demoEmail });
  if (!doctor) {
    const passwordHash = await bcrypt.hash('demo123', 10);
    doctor = await Doctor.create({
      name: 'Arjun Sharma',
      email: demoEmail,
      passwordHash,
      role: 'demo',
      specialty: 'General Medicine',
      phone: '9999999999',
      hospital: 'MediConnect General Hospital',
      license_no: 'MC-DEM-1234',
      experience: 8,
      fee: 500
    });
  }

  const today = new Date();
  const yyyyMmDd = today.toISOString().slice(0, 10);

  // Ensure demo patients exist
  let pts = await Patient.find({ doctorId: doctor._id }).sort({ createdAt: 1 }).limit(2).lean();
  if (pts.length < 2) {
    await Patient.deleteMany({ doctorId: doctor._id });
    pts = await Patient.insertMany([
      {
        doctorId: doctor._id,
        name: 'Riya Patel',
        email: 'riya@example.com',
        phone: '9876543210',
        age: 29,
        gender: 'Female',
        blood_group: 'B+',
        weight: 58,
        allergies: 'None',
        conditions: 'None'
      },
      {
        doctorId: doctor._id,
        name: 'Aman Verma',
        email: 'aman@example.com',
        phone: '9876501234',
        age: 41,
        gender: 'Male',
        blood_group: 'O+',
        weight: 74,
        allergies: 'Penicillin',
        conditions: 'Hypertension'
      }
    ]);
  }

  // Ensure at least 1 appointment for each of the 2 patients exists for today
  const apptCountToday = await Appointment.countDocuments({ doctorId: doctor._id, date: yyyyMmDd });
  if (apptCountToday === 0) {
    await Appointment.insertMany([
      {
        doctorId: doctor._id,
        patientId: pts[0]._id,
        patient_name: pts[0].name,
        patient_phone: pts[0].phone,
        date: yyyyMmDd,
        time: '10:30',
        consultation_type: 'In-clinic',
        reason: 'Fever and sore throat',
        status: 'pending'
      },
      {
        doctorId: doctor._id,
        patientId: pts[1]._id,
        patient_name: pts[1].name,
        patient_phone: pts[1].phone,
        date: yyyyMmDd,
        time: '13:00',
        consultation_type: 'In-clinic',
        reason: 'Follow-up',
        status: 'confirmed'
      }
    ]);
  }

  // Seed one prescription and one invoice (if missing)
  const rxCount = await Prescription.countDocuments({ doctorId: doctor._id });
  if (rxCount === 0) {
    await Prescription.create({
      doctorId: doctor._id,
      patientId: pts[0]._id,
      appointmentId: null,
      patient_name: pts[0].name,
      diagnosis: 'Viral fever',
      medicines: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '3 days' }
      ],
      instructions: 'Take after meals',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });
  }

  const invCount = await Invoice.countDocuments({ doctorId: doctor._id });
  if (invCount === 0) {
    await Invoice.create({
      doctorId: doctor._id,
      patientId: pts[0]._id,
      appointmentId: null,
      patient_name: pts[0].name,
      invoice_no: `INV-${Date.now()}`,
      items: [{ name: 'Consultation Fee', qty: 1, amount: 500 }],
      tax_percent: 0,
      notes: 'Payment due within 7 days',
      amount: 500,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });
  }

  // If patients already exist, still ensure at least 1 notification exists for demo
  const notifCount = await Notification.countDocuments({ doctorId: doctor._id });
  if (notifCount === 0) {
    await Notification.create({
      doctorId: doctor._id,
      type: 'system',
      title: 'Welcome to MediConnect',
      message: 'Your dashboard backend is connected and ready.',
      is_read: false,
      created_at: new Date()
    });
  }
}

module.exports = { ensureSeedData, resetSeedData };
