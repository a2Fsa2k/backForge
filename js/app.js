/* ============================================================
   MediConnect — Doctor Dashboard JavaScript
   ============================================================

   BASE URL: http://localhost:8000/api   (update as needed)

   All API endpoints documented below for backend teams.
   ============================================================ */

const API = 'http://localhost:8000/api';

/* ============================================================
   API ENDPOINT REFERENCE — DOCTOR PORTAL
   ============================================================

   AUTH
   POST   /api/doctor/auth/login        Body: { email, password }  →  { token, doctor }
   POST   /api/doctor/auth/logout
   GET    /api/doctor/auth/me

   DASHBOARD
   GET    /api/doctor/dashboard         →  { stats, today_appointments, recent_patients }

   PATIENTS
   GET    /api/doctor/patients          Query: ?search=&sort=
   GET    /api/doctor/patients/:id      →  full patient profile + history
   GET    /api/doctor/patients/:id/appointments
   GET    /api/doctor/patients/:id/records
   GET    /api/doctor/patients/:id/prescriptions

   APPOINTMENTS
   GET    /api/doctor/appointments      Query: ?status=pending|confirmed|completed|cancelled&date=
   GET    /api/doctor/appointments/:id
   PUT    /api/doctor/appointments/:id  Body: { status }  (confirm/complete/cancel)
   PUT    /api/doctor/appointments/:id/reschedule  Body: { date, time, reason }

   PRESCRIPTIONS
   GET    /api/doctor/prescriptions     Query: ?patient_id=&search=
   POST   /api/doctor/prescriptions     Body: { patient_id, appointment_id, diagnosis, medicines[], instructions, valid_days }
   GET    /api/doctor/prescriptions/:id
   PUT    /api/doctor/prescriptions/:id
   DELETE /api/doctor/prescriptions/:id

   MEDICAL RECORDS
   GET    /api/doctor/records           Query: ?patient_id=&type=
   POST   /api/doctor/records           Body: FormData { patient_id, title, type, date, file, notes }
   GET    /api/doctor/records/:id
   DELETE /api/doctor/records/:id

   LAB ORDERS
   GET    /api/doctor/lab-orders        Query: ?patient_id=&status=
   POST   /api/doctor/lab-orders        Body: { patient_id, tests[], notes, urgency }
   GET    /api/doctor/lab-orders/:id
   PUT    /api/doctor/lab-orders/:id/results  Body: { results[] }

   SCHEDULE
   GET    /api/doctor/schedule          Query: ?month=YYYY-MM
   PUT    /api/doctor/schedule          Body: { availability: { mon:[], tue:[], ... } }
   POST   /api/doctor/schedule/block    Body: { date, reason }
   DELETE /api/doctor/schedule/block/:id
   GET    /api/doctor/schedule/slots    Query: ?date=

   BILLING
   GET    /api/doctor/billing           Query: ?status=&patient_id=
   POST   /api/doctor/billing           Body: { patient_id, appointment_id, items[], due_date }
   GET    /api/doctor/billing/:id
   PUT    /api/doctor/billing/:id/status  Body: { status }

   PROFILE
   GET    /api/doctor/profile
   PUT    /api/doctor/profile           Body: { name, phone, specialty, bio, fee, license_no, hospital, address }
   PUT    /api/doctor/profile/password  Body: { current_password, new_password }

   NOTIFICATIONS
   GET    /api/doctor/notifications
   PUT    /api/doctor/notifications/:id/read
   PUT    /api/doctor/notifications/read-all
   DELETE /api/doctor/notifications/:id

   TELEMEDICINE
   GET    /api/doctor/telemedicine/sessions  Query: ?status=scheduled|completed
   POST   /api/doctor/telemedicine/sessions  Body: { appointment_id, scheduled_at, duration_mins }
   GET    /api/doctor/telemedicine/sessions/:id
   POST   /api/doctor/telemedicine/sessions/:id/join  →  { join_url }
   PUT    /api/doctor/telemedicine/sessions/:id/end
   ============================================================ */

/* ---- Token Helper ---- */
const auth = {
  setToken: t => localStorage.setItem('doctor_token', t),
  getToken: () => localStorage.getItem('doctor_token'),
  clear: () => { localStorage.removeItem('doctor_token'); localStorage.removeItem('doctor_user'); },
  setUser: u => localStorage.setItem('doctor_user', JSON.stringify(u)),
  getUser: () => { try { return JSON.parse(localStorage.getItem('doctor_user')); } catch { return null; } }
};

/* ---- HTTP Helper ---- */
async function api(method, endpoint, body = null, isForm = false) {
  const headers = { 'Authorization': `Bearer ${auth.getToken()}` };
  if (!isForm) headers['Content-Type'] = 'application/json';
  const opts = { method, headers };
  if (body) opts.body = isForm ? body : JSON.stringify(body);
  try {
    const res = await fetch(API + endpoint, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (err) {
    console.error(`[API] ${method} ${endpoint}:`, err.message);
    throw err;
  }
}

const GET  = ep       => api('GET', ep);
const POST = (ep, b, f) => api('POST', ep, b, f);
const PUT  = (ep, b)  => api('PUT', ep, b);
const DEL  = ep       => api('DELETE', ep);

/* ---- Toast ---- */
function toast(msg, type = 'default', duration = 3500) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast toast-${type} show`;
  setTimeout(() => el.classList.remove('show'), duration);
}

/* ---- Modals ---- */
function openModal(id) { const el = document.getElementById(id); if (el) el.classList.add('active'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('active'); }

/* ---- Tabs ---- */
function initTabs(sel) {
  document.querySelectorAll((sel || '') + ' .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.tab;
      const parent = btn.closest('.tabs')?.parentElement;
      parent?.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent?.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(t)?.classList.add('active');
    });
  });
}

/* ---- Require Auth ---- */
function requireAuth() {
  const path = window.location.pathname;
  const onAuthPage = path.endsWith('index.html') || path.endsWith('/');
  if (!auth.getToken() && !onAuthPage) {
    window.location.href = 'index.html';
  }
}

/* ---- Demo mode ---- */
function isDemoMode() {
  return auth.getToken() === 'demo-token';
}

/* ---- Populate Sidebar ---- */
function populateSidebarUser() {
  const doc = auth.getUser();
  if (!doc) return;
  const nameEl = document.getElementById('sidebar-user-name');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl) nameEl.textContent = `Dr. ${doc.name || 'Doctor'}`;
  if (avatarEl) avatarEl.textContent = (doc.name || 'D').charAt(0).toUpperCase();
}

/* ---- Format date ---- */
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/* ---- Close on overlay click ---- */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  populateSidebarUser();
  initTabs();
});
