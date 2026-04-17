# MediConnect — Doctor Dashboard (Frontend + Production‑ready Demo Backend)

A static doctor dashboard UI powered by a Node.js + Express + MongoDB backend.

This repo is optimized for **hackathon demos**: simple to run, predictable seed data, and a clean API that matches the frontend.

---

## Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas (Mongoose)
* **Auth:** JWT (Bearer token)
* **Uploads:** Multer (Medical Records)
* **Validation:** Joi (request validation middleware)
* **Security:** Helmet, XSS sanitization, Mongo operator sanitization
* **Access Control:** RBAC (role-based access control)

---

## Runtime / Deployment Notes

* **Node version:** pinned to **20.x** via `package.json` `engines` (recommended for compatibility on hosts like Render).
* **MongoDB Atlas Network Access:** your cluster must allow connections from your host IP(s). For demos you can temporarily allow `0.0.0.0/0`.

---

## Quick Start (Local)

### 1) Configure env

Create `.env` in the repo root:

* `PORT=8000`
* `MONGO_URI=...`
* `JWT_SECRET=...` (**use a long random secret in production**)
* `CORS_ORIGIN=*`
* `NODE_ENV=development`

**JWT_SECRET (production):** do **not** use placeholder values. Generate a strong secret (example):

```bash
openssl rand -base64 64
```

### 2) Install + run backend

```bash
npm install
npm run dev
```

Backend health check:

* `GET http://localhost:8000/api/health`

### 3) Run the frontend

Serve the folder with any static server and open `index.html`.

Example:

```bash
npx http-server . -p 5500
```

Then open:

* `http://localhost:5500/index.html`

---

## Demo Login (for Judges)

Use these credentials on `index.html`:

| Field | Value |
|---|---|
| Email | `doctor@demo.com` |
| Password | `demo123` |

What happens in the backend:
1. Password is validated using **bcrypt**.
2. A **JWT** is issued (contains `doctor_id` and `role`).
3. Frontend stores JWT and sends it via `Authorization: Bearer <token>`.

---

## RBAC (Role-Based Access Control)

Doctors have a `role` field: `user | admin | demo`.

* Most doctor dashboard endpoints are available to any authenticated doctor.
* Sensitive endpoints can be protected at the **route layer** using RBAC middleware.

**Demo reset is RBAC-protected:** `POST /api/demo/reset` requires role `demo` or `admin`.

---

## Input Validation

Request payloads/params are validated using **Joi** via a shared `validate(...)` middleware.

* Safe + non-breaking: does not change successful response formats.
* Invalid inputs return `400` with `{ success:false, message: ... }`.

---

## DB Seed + RESET (Important for demos)

### Automatic seed
On server start, the backend ensures demo data exists:
* Demo doctor (role: `demo`)
* 2 demo patients
* 2 appointments (1 pending + 1 confirmed for today)
* 1 prescription
* 1 invoice
* notifications

### Manual RESET (recommended before presenting)
To restore the DB back to the original fresh demo state:

* `POST /api/demo/reset`

This will **wipe the database collections** and re-seed the demo dataset.

> Note: reset is restricted to the demo/admin role and additionally guarded in the controller to the demo account.

---

## Core Features Implemented

✅ Authentication (JWT)

✅ Dashboard aggregation

✅ Patients list + patient “View” modal

✅ Appointments tabs + accept/reject/complete + reschedule + notes

✅ Prescriptions CRUD

✅ Billing (invoices) CRUD + status update

✅ Medical Records list + upload + delete (file upload)

✅ Profile view/update + password change

✅ Notifications list + mark read + mark all read + delete

---

## Basic Testing

Lightweight Jest + Supertest tests live under `tests/`.

Run:

```bash
npm test
```

---

## Backend API (high level)

All endpoints are under:

* `http://localhost:8000/api`

Most doctor endpoints require:

* `Authorization: Bearer <JWT>`

### Auth
* `POST /api/doctor/auth/login`
* `GET  /api/doctor/auth/me`
* `POST /api/doctor/auth/logout`

### Dashboard
* `GET /api/doctor/dashboard`

### Patients
* `GET /api/doctor/patients`
* `GET /api/doctor/patients/:id`

### Appointments
* `GET /api/doctor/appointments?status=`
* `GET /api/doctor/appointments/:id`
* `PUT /api/doctor/appointments/:id`
* `PUT /api/doctor/appointments/:id/reschedule`

### Prescriptions
* `GET /api/doctor/prescriptions`
* `POST /api/doctor/prescriptions`
* `GET /api/doctor/prescriptions/:id`
* `PUT /api/doctor/prescriptions/:id`
* `DELETE /api/doctor/prescriptions/:id`

### Billing
* `GET /api/doctor/billing`
* `POST /api/doctor/billing`
* `GET /api/doctor/billing/:id`
* `PUT /api/doctor/billing/:id/status`

### Medical Records
* `GET /api/doctor/records`
* `POST /api/doctor/records` (multipart/form-data)
* `GET /api/doctor/records/:id`
* `DELETE /api/doctor/records/:id`

### Profile
* `GET /api/doctor/profile`
* `PUT /api/doctor/profile`
* `PUT /api/doctor/profile/password`

### Notifications
* `GET /api/doctor/notifications`
* `PUT /api/doctor/notifications/:id/read`
* `PUT /api/doctor/notifications/read-all`
* `DELETE /api/doctor/notifications/:id`

---

## Judge Demo Flow (5–8 minutes)

1. **Reset DB (optional, recommended):** `POST /api/demo/reset`
2. **Login:** `doctor@demo.com / demo123`
3. **Dashboard:** show stats and today’s schedule
4. **Patients:** open a patient → show View modal
5. **Appointments:** accept pending → reschedule confirmed → add notes
6. **Prescriptions:** create and view
7. **Medical Records:** upload a file and open it
8. **Billing:** create invoice → mark paid
9. **Notifications:** mark read / mark all / delete

For deeper explanation, see `DEMO_GUIDE.md`.
