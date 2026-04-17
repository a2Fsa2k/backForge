require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');

const { connectDB } = require('./src/utils/db');
const { notFound, errorHandler } = require('./src/middlewares/error');
const { ensureSeedData } = require('./src/utils/seed');
const { sanitize } = require('./src/middlewares/sanitize');

const doctorAuthRoutes = require('./src/routes/doctorAuthRoutes');
const doctorPatientRoutes = require('./src/routes/doctorPatientRoutes');
const doctorAppointmentRoutes = require('./src/routes/doctorAppointmentRoutes');
const doctorDashboardRoutes = require('./src/routes/doctorDashboardRoutes');
const doctorPrescriptionRoutes = require('./src/routes/doctorPrescriptionRoutes');
const doctorBillingRoutes = require('./src/routes/doctorBillingRoutes');
const doctorRecordRoutes = require('./src/routes/doctorRecordRoutes');
const doctorProfileRoutes = require('./src/routes/doctorProfileRoutes');
const doctorNotificationRoutes = require('./src/routes/doctorNotificationRoutes');
const demoRoutes = require('./src/routes/demoRoutes');

const app = express();

// Trust proxy if deployed behind a reverse proxy (safe default for hackathon hosting)
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: false }));

// Basic security hardening (safe defaults)
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(sanitize);
app.use(xss());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/doctor/auth', doctorAuthRoutes);
app.use('/api/doctor/dashboard', doctorDashboardRoutes);
app.use('/api/doctor/patients', doctorPatientRoutes);
app.use('/api/doctor/appointments', doctorAppointmentRoutes);
app.use('/api/doctor/prescriptions', doctorPrescriptionRoutes);
app.use('/api/doctor/billing', doctorBillingRoutes);
app.use('/api/doctor/records', doctorRecordRoutes);
app.use('/api/doctor/profile', doctorProfileRoutes);
app.use('/api/doctor/notifications', doctorNotificationRoutes);
app.use('/api/demo', demoRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

(async () => {
  await connectDB();
  await ensureSeedData();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`);
  });
})();
