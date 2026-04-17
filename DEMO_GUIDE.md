# MediConnect Doctor Dashboard — Backend Guide + Judge Demo Flow

This document explains the backend code structure, what each module does, and a step‑by‑step demo script for judges.

## Code tree (project overview)

```text
Healthtech-Web-2/
├─ server.js
├─ package.json
├─ .env
├─ index.html
├─ dashboard.html
├─ patients.html
├─ appointments.html
├─ prescriptions.html
├─ billing.html
├─ medical-records.html
├─ notifications.html
├─ lab-orders.html
├─ schedule.html
├─ profile.html
├─ telemedicine.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js
├─ uploads/                      # uploaded medical record files
└─ src/
   ├─ controllers/
   │  ├─ demoController.js
   │  ├─ doctorAuthController.js
   │  ├─ doctorDashboardController.js
   │  ├─ doctorPatientController.js
   │  ├─ doctorAppointmentController.js
   │  ├─ doctorPrescriptionController.js
   │  ├─ doctorBillingController.js
   │  ├─ doctorRecordController.js
   │  ├─ doctorProfileController.js
   │  └─ doctorNotificationController.js
   ├─ routes/
   │  ├─ demoRoutes.js
   │  ├─ doctorAuthRoutes.js
   │  ├─ doctorDashboardRoutes.js
   │  ├─ doctorPatientRoutes.js
   │  ├─ doctorAppointmentRoutes.js
   │  ├─ doctorPrescriptionRoutes.js
   │  ├─ doctorBillingRoutes.js
   │  ├─ doctorRecordRoutes.js
   │  ├─ doctorProfileRoutes.js
   │  └─ doctorNotificationRoutes.js
   ├─ models/
   │  ├─ Doctor.js
   │  ├─ Patient.js
   │  ├─ Appointment.js
   │  ├─ Prescription.js
   │  ├─ Invoice.js
   │  ├─ MedicalRecord.js
   │  └─ Notification.js
   ├─ middlewares/
   │  ├─ auth.js
   │  ├─ upload.js
   │  └─ error.js
   └─ utils/
      ├─ db.js
      ├─ respond.js
      └─ seed.js
```

## What each backend part does

### `server.js`
* Express app entrypoint.
* Loads `.env`, sets CORS + JSON parsing + request logging.
* Connects to MongoDB via `src/utils/db.js`.
* Seeds demo data via `src/utils/seed.js`.
* Registers API routes under `/api/...`.

Key endpoints:
* `GET /api/health` — health check
* `POST /api/doctor/auth/login` — login


### `src/utils/db.js`
* Connects to MongoDB (Mongoose) using `MONGO_URI`.


### `src/utils/respond.js`
* Response helpers.
* `ok(res, payload)` returns `{ success: true, data: payload, ...payload }`.
* `fail(res, message, code)` returns `{ success: false, message }`.

This “spreads” fields to top-level to match the static frontend expectations.


### `src/middlewares/auth.js`
* Protects doctor routes.
* Validates JWT token from `Authorization: Bearer <token>`.
* Adds `req.doctorId` so controllers can scope queries to the current doctor.


### `src/utils/seed.js`
* `ensureSeedData()` creates the seeded demo doctor + demo patients + demo appointment/prescription/invoice/notifications.
* `resetSeedData()` wipes collections in the connected MongoDB DB (used by the demo reset route).


### Models (`src/models/*`)
Mongoose schemas representing core entities:

* `Doctor` — auth identity + profile fields
* `Patient` — per-doctor patients
* `Appointment` — appointment workflow (pending/confirmed/completed/cancelled)
* `Prescription` — medicines + validity
* `Invoice` — billing items + status
* `MedicalRecord` — uploads metadata + file url
* `Notification` — unread/read alerts


### Routes + controllers
Routes map HTTP endpoints to controllers; controllers implement business logic.

* Auth
  * `POST /api/doctor/auth/login`
  * `GET /api/doctor/auth/me`
  * `POST /api/doctor/auth/logout`

* Dashboard
  * `GET /api/doctor/dashboard` — aggregated stats + lists

* Patients
  * `GET /api/doctor/patients` — list/search/sort
  * `GET /api/doctor/patients/:id` — patient detail (for “View” modal)

* Appointments
  * `GET /api/doctor/appointments?status=` — tab lists
  * `GET /api/doctor/appointments/:id` — detail modal
  * `PUT /api/doctor/appointments/:id` — status update + notes
  * `PUT /api/doctor/appointments/:id/reschedule` — date/time update

* Prescriptions
  * `GET /api/doctor/prescriptions`
  * `POST /api/doctor/prescriptions`
  * `GET /api/doctor/prescriptions/:id`
  * `PUT /api/doctor/prescriptions/:id`
  * `DELETE /api/doctor/prescriptions/:id`

* Billing
  * `GET /api/doctor/billing`
  * `POST /api/doctor/billing`
  * `GET /api/doctor/billing/:id`
  * `PUT /api/doctor/billing/:id/status`

* Medical Records
  * `GET /api/doctor/records`
  * `POST /api/doctor/records` (multipart/form-data; Multer)
  * `GET /api/doctor/records/:id`
  * `DELETE /api/doctor/records/:id`

* Profile
  * `GET /api/doctor/profile`
  * `PUT /api/doctor/profile`
  * `PUT /api/doctor/profile/password`

* Notifications
  * `GET /api/doctor/notifications`
  * `PUT /api/doctor/notifications/:id/read`
  * `PUT /api/doctor/notifications/read-all`
  * `DELETE /api/doctor/notifications/:id`

* Demo utilities (for judges / hackathon convenience)
  * `POST /api/demo/reset` — wipes and reseeds DB (use before a live demo)


## How the backend works (high-level)

1. **Doctor logs in** (`/api/doctor/auth/login`)
   * Backend verifies password (bcrypt)
   * Issues a JWT containing `doctor_id`

2. **Frontend calls protected endpoints**
   * Sends `Authorization: Bearer <JWT>`
   * `authRequired` middleware extracts and verifies JWT
   * Controllers filter by `doctorId` so each doctor only sees their own data

3. **Mongoose models** read/write MongoDB
   * Simple CRUD operations with minimal validation
   * Denormalized fields (like `patient_name`) are used for quick UI lists


## Judge demo script (5–8 minutes)

> Goal: show end-to-end workflows quickly while explaining what the backend is doing.

### Pre-demo (30 seconds)
1. Open backend terminal: confirm `GET /api/health` returns OK.
2. (Optional) Reset to clean state:
   * Call `POST /api/demo/reset`

Explain:
* “This guarantees a known clean dataset every time we present.”


### 1) Login (30 seconds)
On `index.html`:
* Login with `doctor@demo.com / demo123`

Explain backend:
* “On login we bcrypt-compare passwords and return a JWT. All future requests include it in Authorization header.”


### 2) Dashboard (45 seconds)
On `dashboard.html`:
* Show stats + today’s appointments + recent patients

Explain backend:
* “Dashboard is an aggregated endpoint that reads patients + appointments + billing + notifications.”


### 3) Patients + View modal (60 seconds)
On `patients.html`:
* Search / sort
* Click **View** on a patient (opens modal)

Explain backend:
* “Patient lists are filtered by doctorId. The view modal calls `/patients/:id` for a full profile payload.”


### 4) Appointments workflow (90 seconds)
On `appointments.html`:
* Open Pending tab → **Accept** a pending appointment
* Open Confirmed tab → **Reschedule** OR **Mark Completed**
* Open any appointment → add **Notes** → **Save Notes**

Explain backend:
* “Status updates are `PUT /appointments/:id` and reschedule is `PUT /appointments/:id/reschedule`. Notes are stored on the appointment document.”


### 5) Prescriptions (60–90 seconds)
On `prescriptions.html`:
* Create a prescription for a patient
* View it

Explain backend:
* “Prescriptions are stored as a document with embedded medicines array. It’s easy to create and list.”


### 6) Medical records upload (60 seconds)
On `medical-records.html`:
* Upload a file for a patient
* Then open the file link (served from `/uploads/...`)

Explain backend:
* “Multer handles multipart upload. We store metadata in MongoDB and serve the files statically from `/uploads`.”


### 7) Billing (45–60 seconds)
On `billing.html`:
* Create an invoice
* Mark it Paid

Explain backend:
* “Invoices are simple documents with line items. Status updates are a `PUT` endpoint.”


### 8) Notifications (30–45 seconds)
On `notifications.html`:
* Mark one read, mark all read, delete

Explain backend:
* “Notifications are stored per doctor and support read/unread operations.”


## Optional: Troubleshooting notes

* If buttons stop working after changes, check browser console for inline onclick errors.
* If API shows 401, confirm token exists in localStorage and backend JWT secret matches.
* If you want a fresh dataset for demos, use `/api/demo/reset`.
