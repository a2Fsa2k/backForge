// NEW: Lightweight express app for tests.
// Keeps production server.js unchanged (no refactor) while enabling supertest.

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { notFound, errorHandler } = require('../src/middlewares/error');
const { sanitize } = require('../src/middlewares/sanitize');

const doctorAuthRoutes = require('../src/routes/doctorAuthRoutes');

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(sanitize);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/doctor/auth', doctorAuthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
