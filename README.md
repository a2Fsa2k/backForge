# MediConnect — Doctor Dashboard
## Participant Documentation

---

## What You Need to Build

This repo has the **complete frontend** for a healthcare doctor dashboard. Your job is to build the **backend (server + database)** that makes it work.

The frontend is already wired up — every button, form, and page makes API calls to your server. You just need to handle those calls and return the right data.

---

## Getting Started

**Step 1** — Clone this repo and open `index.html` in a browser
**Step 2** — Use the demo credentials below to explore all pages (no backend needed for preview)
**Step 3** — Open `js/app.js` and update the base URL to point to your server:

```
const API = 'http://localhost:8000/api';   ← change this to your server address
```

**Step 4** — Build your backend to handle the API calls described in this document

---

## Demo Credentials

Use these to preview the frontend without a backend running:

| Field    | Value             |
|----------|-------------------|
| Email    | doctor@demo.com   |
| Password | demo123           |

---

## Tech Stack

You can use **any** backend language or framework:

- Node.js (Express / Fastify)
- Python (Django / FastAPI / Flask)
- Java (Spring Boot)
- PHP (Laravel)
- Go, Ruby, etc.

**Database:** MySQL, PostgreSQL, MongoDB, Firebase — your choice.

---

## How the Frontend Talks to Your Backend

Every request the frontend makes includes a **token** in the header to identify the logged-in doctor:

```
Authorization: Bearer <token>
```

Your login endpoint must return this token. The frontend saves it and sends it with every future request automatically.

> All doctor endpoints are prefixed with `/api/doctor/` to separate them from patient routes.

---

## Important Rules

- Your login API **must** return a field named `token` and the doctor object under key `doctor` — the frontend looks for these exact names
- All dates must be in this format: `2026-04-15` (YYYY-MM-DD) or `2026-04-15T10:00:00Z` for timestamps
- Enable **CORS** on your server — the frontend runs from a different origin
- For file uploads, your endpoint must accept `multipart/form-data`
- When something goes wrong, return an error with a `message` field explaining what happened

---

## How to Read This Document

Each feature below shows:

- **What it does** — plain English description
- **Endpoints** — the URL and method the frontend calls
- **What to receive** — fields the frontend sends to your server
- **What to return** — fields your server must send back

---

---

# Feature 1 — Login

**Page:** `index.html`

Doctors sign in using their registered credentials. Registration is admin-controlled — doctors cannot self-register.

---

### Login

**Frontend calls:** `POST /api/doctor/auth/login`

**Your server receives:**

| Field    | Type  | Description        |
|----------|-------|--------------------|
| email    | email | Doctor's email     |
| password | text  | Doctor's password  |

**Your server must return:**

| Field          | Type   | Description                        |
|----------------|--------|------------------------------------|
| token          | text   | Auth token for future requests     |
| doctor.id      | number | Unique ID of the doctor            |
| doctor.name    | text   | Doctor's name                      |
| doctor.specialty | text | Doctor's specialty                 |
| doctor.email   | text   | Doctor's email                     |
| doctor.hospital| text   | Hospital or clinic name            |

> If the email or password is wrong, return an error with `message: "Invalid email or password"`

---

### Other Auth Endpoints

| Endpoint                  | Method | What it does                          |
|---------------------------|--------|---------------------------------------|
| /api/doctor/auth/logout   | POST   | End the session (invalidate token)    |
| /api/doctor/auth/me       | GET    | Return the logged-in doctor's info    |

---

---

# Feature 2 — Dashboard

**Page:** `dashboard.html`

The first page doctors see after logging in. Shows today's appointments, patient stats, pending requests, and lab orders.

---

**Frontend calls:** `GET /api/doctor/dashboard`

**Your server must return:**

### Stats section (shown as cards at the top)

| Field                        | Type   | Description                          |
|------------------------------|--------|--------------------------------------|
| stats.today_appointments     | number | Appointments scheduled for today     |
| stats.total_patients         | number | Total patients under this doctor     |
| stats.pending_requests       | number | Appointment requests awaiting action |
| stats.prescriptions_month    | number | Prescriptions issued this month      |
| stats.revenue_month          | number | Revenue earned this month in ₹       |

### Today's appointments list

| Field                              | Type   | Description                         |
|------------------------------------|--------|-------------------------------------|
| today_appointments[].id            | number | Appointment ID                      |
| today_appointments[].patient_name  | text   | Patient's name                      |
| today_appointments[].time          | text   | e.g. 09:00 AM                       |
| today_appointments[].type          | text   | General consultation / Follow-up    |
| today_appointments[].consultation_type | text | in-clinic or online            |
| today_appointments[].status        | text   | confirmed / pending                 |

### Recent patients list

| Field                       | Type   | Description              |
|-----------------------------|--------|--------------------------|
| recent_patients[].id        | number | Patient ID               |
| recent_patients[].name      | text   | Patient's name           |
| recent_patients[].age       | number | Patient's age            |
| recent_patients[].last_visit| date   | Date of last visit       |

### Pending lab orders list

| Field                          | Type   | Description                |
|--------------------------------|--------|----------------------------|
| pending_lab_orders[].id        | number | Lab order ID               |
| pending_lab_orders[].test_name | text   | Name of the test           |
| pending_lab_orders[].patient_name | text| Patient's name             |
| pending_lab_orders[].ordered_at| date   | When it was ordered        |

---

---

# Feature 3 — Patient Management

**Page:** `patients.html`

Doctors view all their patients, search and filter them, and access each patient's full medical history.

---

### Get patients list

**Frontend calls:** `GET /api/doctor/patients`

**The frontend may send these as URL filters:**

| Filter | Type | Description                                              |
|--------|------|----------------------------------------------------------|
| search | text | Search by patient name or phone                          |
| sort   | text | recent / name_asc / name_desc / appointments             |

**Your server must return a list where each patient has:**

| Field        | Type   | Description                          |
|--------------|--------|--------------------------------------|
| id           | number | Patient ID                           |
| name         | text   | Patient's full name                  |
| email        | text   | Patient's email                      |
| phone        | text   | Phone number                         |
| age          | number | Patient's age                        |
| gender       | text   | Male / Female / Other                |
| blood_group  | text   | e.g. B+, O-                          |
| weight       | number | Weight in kg                         |
| last_visit   | date   | Date of last appointment             |
| total_visits | number | Total number of visits               |

---

### Get one patient's full profile

**Frontend calls:** `GET /api/doctor/patients/:id`

Returns all fields above plus:

| Field        | Type | Description                              |
|--------------|------|------------------------------------------|
| height       | number | Height in cm                           |
| allergies    | text | Known allergies                          |
| conditions   | text | Chronic conditions                       |
| appointments | list | Patient's appointment history            |
| prescriptions| list | Prescriptions issued to this patient     |
| records      | list | Medical records uploaded for this patient|

---

### Other Patient Endpoints

| Endpoint                              | Method | What it does                                  |
|---------------------------------------|--------|-----------------------------------------------|
| /api/doctor/patients/:id/appointments | GET    | All appointments for a specific patient       |
| /api/doctor/patients/:id/records      | GET    | All medical records for a specific patient    |
| /api/doctor/patients/:id/prescriptions| GET    | All prescriptions for a specific patient      |

---

---

# Feature 4 — Appointments

**Page:** `appointments.html`

Doctors manage incoming appointment requests and their scheduled consultations.

---

### Get appointments list

**Frontend calls:** `GET /api/doctor/appointments`

**The frontend may send these as URL filters:**

| Filter | Type | Description                                          |
|--------|------|------------------------------------------------------|
| status | text | pending / confirmed / completed / cancelled          |
| date   | date | Filter by specific date (YYYY-MM-DD)                 |

**Your server must return a list where each appointment has:**

| Field               | Type   | Description                              |
|---------------------|--------|------------------------------------------|
| id                  | number | Appointment ID                           |
| patient_name        | text   | Patient's name                           |
| patient_phone       | text   | Patient's phone number                   |
| date                | date   | Appointment date                         |
| time                | text   | e.g. 10:00 AM                            |
| consultation_type   | text   | In-clinic or Online                      |
| reason              | text   | Patient's reason for visiting            |
| status              | text   | pending / confirmed / completed / cancelled |
| notes               | text   | Consultation notes (null if not added)   |
| cancel_reason       | text   | Reason for cancellation (null if N/A)    |
| cancelled_by        | text   | Who cancelled it (null if N/A)           |

---

### Update an appointment

**Frontend calls:** `PUT /api/doctor/appointments/:id`

**Your server receives (either or both):**

| Field  | Type | Description                                           |
|--------|------|-------------------------------------------------------|
| status | text | New status: confirmed / completed / cancelled         |
| notes  | text | Consultation notes to add                             |

---

### Reschedule an appointment

**Frontend calls:** `PUT /api/doctor/appointments/:id/reschedule`

**Your server receives:**

| Field  | Type | Description                          |
|--------|------|--------------------------------------|
| date   | date | New appointment date                 |
| time   | text | New time slot                        |
| reason | text | Reason for rescheduling              |

> After rescheduling, notify the patient via a notification.

---

---

# Feature 5 — Prescriptions

**Page:** `prescriptions.html`

Doctors write and manage prescriptions for patients.

---

### Get prescriptions list

**Frontend calls:** `GET /api/doctor/prescriptions`

**The frontend may send these as URL filters:**

| Filter     | Type | Description                    |
|------------|------|--------------------------------|
| patient_id | number | Filter by specific patient   |
| search     | text | Search by patient name or diagnosis |

**Your server must return a list where each prescription has:**

| Field        | Type   | Description                          |
|--------------|--------|--------------------------------------|
| id           | number | Prescription ID                      |
| patient_name | text   | Patient's name                       |
| diagnosis    | text   | What it was prescribed for           |
| date         | date   | Date issued                          |
| valid_until  | date   | Expiry date                          |
| status       | text   | active or expired                    |
| medicines    | list   | List of medicines (at least `name`)  |

---

### Write a new prescription

**Frontend calls:** `POST /api/doctor/prescriptions`

**Your server receives:**

| Field          | Type   | Required | Description                        |
|----------------|--------|----------|------------------------------------|
| patient_id     | number | Yes      | ID of the patient                  |
| appointment_id | number | No       | Related appointment ID             |
| diagnosis      | text   | Yes      | What is being treated              |
| instructions   | text   | No       | General instructions               |
| valid_days     | number | Yes      | How many days the prescription lasts |
| medicines      | list   | Yes      | List of medicines (see below)      |

**Each medicine in the list must have:**

| Field        | Type | Description                      |
|--------------|------|----------------------------------|
| name         | text | Medicine name                    |
| dosage       | text | e.g. 1 tablet                    |
| frequency    | text | e.g. Twice daily                 |
| duration     | text | e.g. 5 days                      |
| instructions | text | e.g. After meals                 |

**Your server must return:**

| Field   | Type   | Description                          |
|---------|--------|--------------------------------------|
| id      | number | ID of the new prescription           |
| message | text   | Confirmation message                 |

> After issuing, send a notification to the patient that a new prescription is available.

---

### Other Prescription Endpoints

| Endpoint                       | Method | What it does                                  |
|--------------------------------|--------|-----------------------------------------------|
| /api/doctor/prescriptions/:id  | GET    | Full details of a single prescription         |
| /api/doctor/prescriptions/:id  | PUT    | Edit an existing prescription                 |
| /api/doctor/prescriptions/:id  | DELETE | Delete a prescription                         |

---

---

# Feature 6 — Medical Records

**Page:** `medical-records.html`

Doctors upload and manage medical records for their patients.

---

### Get records list

**Frontend calls:** `GET /api/doctor/records`

**The frontend may send these as URL filters:**

| Filter     | Type | Description                            |
|------------|------|----------------------------------------|
| patient_id | number | Filter by specific patient           |
| type       | text | Filter by record type                  |
| search     | text | Search by title or patient name        |

**Your server must return a list where each record has:**

| Field        | Type   | Description                              |
|--------------|--------|------------------------------------------|
| id           | number | Record ID                                |
| title        | text   | e.g. Post-op Report - March 2026         |
| patient_name | text   | Patient's name                           |
| type         | text   | Surgery Report / Blood Test / X-Ray etc. |
| date         | date   | Date of the record                       |
| notes        | text   | Notes about the record                   |
| file_url     | text   | Link to view/download the file           |

---

### Upload a record

**Frontend calls:** `POST /api/doctor/records`

This is a **file upload** request (multipart/form-data).

**Your server receives:**

| Field      | Type   | Required | Description                       |
|------------|--------|----------|-----------------------------------|
| patient_id | number | Yes      | ID of the patient                 |
| title      | text   | Yes      | Name/title of the record          |
| type       | text   | Yes      | Category of the record            |
| date       | date   | Yes      | Date the record was created       |
| notes      | text   | No       | Additional notes                  |
| file       | file   | No       | The document (PDF, JPG, PNG)      |

**Your server must return:**

| Field   | Type   | Description              |
|---------|--------|--------------------------|
| id      | number | ID of the new record     |
| message | text   | Success message          |

---

### Other Records Endpoints

| Endpoint                  | Method | What it does                    |
|---------------------------|--------|---------------------------------|
| /api/doctor/records/:id   | GET    | Full details of a single record |
| /api/doctor/records/:id   | DELETE | Delete a record                 |

---

---

# Feature 7 — Lab Orders

**Page:** `lab-orders.html`

Doctors order diagnostic tests for patients and view results when ready.

---

### Get lab orders list

**Frontend calls:** `GET /api/doctor/lab-orders`

**The frontend may send these as URL filters:**

| Filter     | Type | Description                          |
|------------|------|--------------------------------------|
| patient_id | number | Filter by specific patient         |
| status     | text | pending / ready / all                |

**Your server must return a list where each order has:**

| Field        | Type    | Description                              |
|--------------|---------|------------------------------------------|
| id           | number  | Lab order ID                             |
| patient_name | text    | Patient's name                           |
| tests        | list    | List of test names ordered               |
| urgency      | text    | routine / urgent / stat                  |
| status       | text    | pending or ready                         |
| ordered_at   | date    | When it was ordered                      |
| has_abnormal | boolean | true if any result is outside normal range|

---

### Order lab tests

**Frontend calls:** `POST /api/doctor/lab-orders`

**Your server receives:**

| Field      | Type   | Required | Description                             |
|------------|--------|----------|-----------------------------------------|
| patient_id | number | Yes      | ID of the patient                       |
| tests      | list   | Yes      | List of test names to order             |
| urgency    | text   | Yes      | routine / urgent / stat                 |
| notes      | text   | No       | Additional notes for the lab            |

**Your server must return:**

| Field   | Type   | Description                        |
|---------|--------|------------------------------------|
| id      | number | ID of the new lab order            |
| message | text   | Confirmation message               |

> After ordering, notify the patient to visit the lab.

---

### Get one lab order with results

**Frontend calls:** `GET /api/doctor/lab-orders/:id`

Returns all fields from the list above plus:

| Field    | Type | Description                              |
|----------|------|------------------------------------------|
| lab_name | text | Name of the diagnostic lab               |
| remarks  | text | Pathologist's comments                   |
| results  | list | List of test results (if ready)          |

**Each result in the list must have:**

| Field     | Type | Description                      |
|-----------|------|----------------------------------|
| test_name | text | e.g. CBC                         |
| parameters| list | List of measured values (see below)|

**Each parameter must have:**

| Field     | Type | Description                              |
|-----------|------|------------------------------------------|
| name      | text | e.g. Haemoglobin, WBC Count              |
| value     | text | The measured value                       |
| unit      | text | e.g. g/dL, 10³/µL                        |
| reference | text | Normal range e.g. 13.5–17.5              |
| flag      | text | High / Low / null (null = Normal)        |

---

### Enter lab results

**Frontend calls:** `PUT /api/doctor/lab-orders/:id/results`

Used by a lab technician role (optional). Accepts results in the same format as above.

---

---

# Feature 8 — Schedule Management

**Page:** `schedule.html`

Doctors set their weekly availability and block dates for leaves or holidays.

---

### Get schedule

**Frontend calls:** `GET /api/doctor/schedule?month=2026-04`

**Your server must return:**

### Availability settings (one entry per day of the week)

| Field                       | Type    | Description                          |
|-----------------------------|---------|--------------------------------------|
| availability.monday.active  | boolean | true = working that day              |
| availability.monday.start   | text    | Start time e.g. 09:00                |
| availability.monday.end     | text    | End time e.g. 17:00                  |
| slot_duration               | number  | Minutes per appointment slot         |
| max_appointments            | number  | Max appointments per day             |

### Blocked dates list

| Field               | Type   | Description                           |
|---------------------|--------|---------------------------------------|
| blocked_dates[].id  | number | Block ID                              |
| blocked_dates[].date| date   | The blocked date                      |
| blocked_dates[].reason | text| e.g. Vacation / Leave                 |
| blocked_dates[].created_at | date | When it was blocked              |

---

### Update availability

**Frontend calls:** `PUT /api/doctor/schedule`

**Your server receives:**

| Field            | Type    | Description                           |
|------------------|---------|---------------------------------------|
| availability     | object  | Updated settings for each day         |
| slot_duration    | number  | Minutes per slot                      |
| max_appointments | number  | Max appointments per day              |

> After updating, regenerate available time slots based on the new settings.

---

### Get time slots for a date

**Frontend calls:** `GET /api/doctor/schedule/slots?date=2026-04-14`

**Your server must return a list where each slot has:**

| Field        | Type   | Description                                        |
|--------------|--------|----------------------------------------------------|
| time         | text   | e.g. 09:00 AM                                      |
| status       | text   | free / booked / blocked                            |
| patient_name | text   | Patient's name (only if status is booked)          |

---

### Block a date

**Frontend calls:** `POST /api/doctor/schedule/block`

**Your server receives:**

| Field  | Type | Description                  |
|--------|------|------------------------------|
| date   | date | The date to block            |
| reason | text | e.g. Vacation / Leave        |

> After blocking, cancel all existing appointments on this date and notify patients.

---

### Unblock a date

**Frontend calls:** `DELETE /api/doctor/schedule/block/:id`

No data is sent. Just remove the block for that date.

---

---

# Feature 9 — Billing

**Page:** `billing.html`

Doctors generate invoices for patients and track payment status.

---

### Get bills list

**Frontend calls:** `GET /api/doctor/billing`

**The frontend may send these as URL filters:**

| Filter     | Type | Description                            |
|------------|------|----------------------------------------|
| status     | text | pending / paid / overdue               |
| patient_id | number | Filter by specific patient           |
| search     | text | Search by patient name or invoice no.  |

**Your server must return a list where each bill has:**

| Field        | Type   | Description                              |
|--------------|--------|------------------------------------------|
| id           | number | Bill ID                                  |
| invoice_no   | text   | e.g. INV-2026-001                        |
| patient_name | text   | Patient's name                           |
| description  | text   | Short description of what was charged    |
| amount       | number | Total amount in ₹                        |
| date         | date   | Invoice date                             |
| due_date     | date   | Payment due date                         |
| status       | text   | pending / paid / overdue                 |

---

### Generate a new invoice

**Frontend calls:** `POST /api/doctor/billing`

**Your server receives:**

| Field          | Type   | Required | Description                             |
|----------------|--------|----------|-----------------------------------------|
| patient_id     | number | Yes      | ID of the patient                       |
| appointment_id | number | No       | Related appointment ID                  |
| items          | list   | Yes      | Line items (see below)                  |
| tax_percent    | number | No       | Tax percentage to apply                 |
| due_date       | date   | Yes      | Payment due date                        |
| notes          | text   | No       | Payment terms or notes                  |

**Each item in the list must have:**

| Field  | Type   | Description                       |
|--------|--------|-----------------------------------|
| name   | text   | e.g. Consultation Fee, ECG Test   |
| qty    | number | Quantity                          |
| amount | number | Amount for this item in ₹         |

**Your server must return:**

| Field      | Type   | Description                            |
|------------|--------|----------------------------------------|
| id         | number | ID of the new invoice                  |
| invoice_no | text   | e.g. INV-2026-015                      |
| total      | number | Total amount in ₹                      |
| message    | text   | Confirmation message                   |

> After generating, notify the patient about the new invoice.

---

### Update payment status

**Frontend calls:** `PUT /api/doctor/billing/:id/status`

**Your server receives:**

| Field  | Type | Description                        |
|--------|------|------------------------------------|
| status | text | New status: pending / paid / overdue|

---

### Other Billing Endpoints

| Endpoint                      | Method | What it does                           |
|-------------------------------|--------|----------------------------------------|
| /api/doctor/billing/:id       | GET    | Full invoice details with line items   |

---

---

# Feature 10 — Profile

**Page:** `profile.html`

Doctors manage their professional profile visible to patients.

---

### Get profile

**Frontend calls:** `GET /api/doctor/profile`

**Your server must return:**

| Field          | Type   | Description                           |
|----------------|--------|---------------------------------------|
| id             | number | Doctor ID                             |
| name           | text   | Full name                             |
| email          | text   | Email address                         |
| phone          | text   | Phone number                          |
| specialty      | text   | Medical specialty                     |
| license_no     | text   | Medical license number                |
| experience     | number | Years of experience                   |
| fee            | number | Consultation fee in ₹                 |
| qualifications | text   | e.g. MBBS, MD (Internal Medicine)     |
| hospital       | text   | Hospital or clinic name               |
| address        | text   | Clinic address                        |
| languages      | text   | Languages spoken                      |
| bio            | text   | Professional description              |
| visibility     | text   | public or private                     |

---

### Update profile

**Frontend calls:** `PUT /api/doctor/profile`

Accepts any subset of the fields listed above. Update only what is sent.

---

### Change password

**Frontend calls:** `PUT /api/doctor/profile/password`

**Your server receives:**

| Field            | Type | Description            |
|------------------|------|------------------------|
| current_password | text | Their current password |
| new_password     | text | The new password       |

> If the current password is wrong, return an error: `message: "Current password is incorrect"`

---

---

# Feature 11 — Notifications

**Page:** `notifications.html`

Doctors receive alerts for appointment requests, lab results, patient activity, and billing.

---

### Get all notifications

**Frontend calls:** `GET /api/doctor/notifications`

**Your server must return a list where each notification has:**

| Field      | Type    | Description                                                      |
|------------|---------|------------------------------------------------------------------|
| id         | number  | Notification ID                                                  |
| type       | text    | appointment / lab / patient / billing / system                   |
| title      | text    | Short heading e.g. "New Appointment Request"                     |
| message    | text    | Full message text                                                |
| is_read    | boolean | false = unread (shown highlighted), true = already seen          |
| created_at | date    | When the notification was created                                |

---

### Other Notification Endpoints

| Endpoint                                | Method | What it does                       |
|-----------------------------------------|--------|------------------------------------|
| /api/doctor/notifications/:id/read      | PUT    | Mark one notification as read      |
| /api/doctor/notifications/read-all      | PUT    | Mark all notifications as read     |
| /api/doctor/notifications/:id           | DELETE | Delete a single notification       |

---

---

# Feature 12 — Telemedicine

**Page:** `telemedicine.html`

Doctors schedule and conduct video consultations with patients.

---

### Get sessions list

**Frontend calls:** `GET /api/doctor/telemedicine/sessions`

**The frontend may send these as URL filters:**

| Filter | Type | Description                              |
|--------|------|------------------------------------------|
| status | text | scheduled / completed / cancelled        |

**Your server must return a list where each session has:**

| Field          | Type   | Description                              |
|----------------|--------|------------------------------------------|
| id             | number | Session ID                               |
| patient_name   | text   | Patient's name                           |
| scheduled_at   | date   | Date and time of the session             |
| duration_mins  | number | Session duration in minutes              |
| status         | text   | scheduled / live / completed / cancelled |
| notes          | text   | Session notes                            |

---

### Schedule a new session

**Frontend calls:** `POST /api/doctor/telemedicine/sessions`

**Your server receives:**

| Field          | Type   | Required | Description                             |
|----------------|--------|----------|-----------------------------------------|
| patient_id     | number | Yes      | ID of the patient                       |
| appointment_id | number | No       | Related appointment ID                  |
| scheduled_at   | date   | Yes      | Date and time of the session            |
| duration_mins  | number | Yes      | How long the session will last          |
| notes          | text   | No       | Notes for the patient before the call   |

**Your server must return:**

| Field    | Type   | Description                                  |
|----------|--------|----------------------------------------------|
| id       | number | Session ID                                   |
| join_url | text   | Video call link                              |
| message  | text   | Confirmation message                         |

> Generate a unique video call link using any video API (Jitsi, Daily.co, Whereby, etc.) and notify the patient with the link.

---

### Join a session

**Frontend calls:** `POST /api/doctor/telemedicine/sessions/:id/join`

**Your server must return:**

| Field        | Type | Description                     |
|--------------|------|---------------------------------|
| join_url     | text | Video call link                 |
| patient_name | text | Patient's name                  |

> Update the session status to `live`.

---

### Other Session Endpoints

| Endpoint                                        | Method | What it does                                 |
|-------------------------------------------------|--------|----------------------------------------------|
| /api/doctor/telemedicine/sessions/:id           | GET    | Full session details including join URL       |
| /api/doctor/telemedicine/sessions/:id           | PUT    | Update notes or follow-up after the call     |
| /api/doctor/telemedicine/sessions/:id/end       | PUT    | End or cancel a session                      |

---

---

## Error Handling

Whenever something goes wrong, your server must return an appropriate HTTP status code and a `message` field:

| Situation                            | Status Code | Example message                    |
|--------------------------------------|-------------|------------------------------------|
| Wrong email or password              | 401         | Invalid email or password          |
| Missing required field               | 400         | Name is required                   |
| Record not found                     | 404         | Appointment not found              |
| Not logged in                        | 401         | Authentication required            |
| Trying to access another doctor's data | 403       | Access denied                      |
| Something broke on the server        | 500         | Internal server error              |

---

## Evaluation Criteria

| What is checked                        | Weight |
|----------------------------------------|--------|
| All 12 features working correctly      | 40%    |
| API response fields match exactly      | 20%    |
| Login and auth working securely        | 15%    |
| Proper error messages returned         | 10%    |
| Clean, readable code                   | 10%    |
| Bonus: File upload working             | 5%     |

---

*MediConnect Doctor Dashboard — BackForge Healthtech Competition*
