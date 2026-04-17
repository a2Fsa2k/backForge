const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

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
      specialty: 'General Medicine',
      phone: '9999999999',
      hospital: 'MediConnect General Hospital',
      license_no: 'MC-DEM-1234',
      experience: 8,
      fee: 500
    });
  }

  const patientCount = await Patient.countDocuments({ doctorId: doctor._id });
  if (patientCount === 0) {
    const pts = await Patient.insertMany([
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

    const today = new Date();
    const yyyyMmDd = today.toISOString().slice(0, 10);

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
}

module.exports = { ensureSeedData };
