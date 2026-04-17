require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { connectDB } = require('./src/utils/db');
const { notFound, errorHandler } = require('./src/middlewares/error');
const { ensureSeedData } = require('./src/utils/seed');

const doctorAuthRoutes = require('./src/routes/doctorAuthRoutes');
const doctorPatientRoutes = require('./src/routes/doctorPatientRoutes');
const doctorAppointmentRoutes = require('./src/routes/doctorAppointmentRoutes');

const app = express();

// Trust proxy if deployed behind a reverse proxy (safe default for hackathon hosting)
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/doctor/auth', doctorAuthRoutes);
app.use('/api/doctor/patients', doctorPatientRoutes);
app.use('/api/doctor/appointments', doctorAppointmentRoutes);

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
