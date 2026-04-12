# MediConnect — Doctor Dashboard
## Backend Competition Documentation

---

## Overview

This repository contains the **complete frontend** for the MediConnect Doctor Dashboard — a professional healthcare management platform. Your task as a participant is to **build the backend** that powers this frontend.

The frontend is built with plain HTML, CSS, and JavaScript. All API calls are made via `fetch()` in `js/app.js`. You do not need to touch the frontend code.

---

## Quick Start

1. Clone this repo
2. Open `index.html` in a browser — use **Demo Credentials** to preview all pages without a backend
3. Set your backend base URL in `js/app.js`:
   ```js
   const API = 'http://localhost:8000/api'; // change to your server
   ```
4. Build your backend to match the API contract below

---

## Demo Credentials (Frontend Preview)

| Field    | Value                |
|----------|----------------------|
| Email    | `doctor@demo.com`    |
| Password | `demo123`            |

> These bypass the API. Remove or disable in production.

---

## Tech Stack (Your Choice)

You may use any backend technology:
- Node.js (Express / Fastify)
- Python (Django / FastAPI / Flask)
- Java (Spring Boot)
- PHP (Laravel)
- Go, Ruby, etc.

**Database:** Any relational (MySQL, PostgreSQL) or NoSQL (MongoDB) database.

---

## Authentication

All protected routes must receive a **Bearer token** in the request header:

```
Authorization: Bearer <token>
```

The token is stored in `localStorage` as `doctor_token` after login.

> **Note:** All doctor endpoints are prefixed with `/api/doctor/` to separate them from patient routes.

---

## API Endpoints — Full Reference

---

### 1. Authentication

**Page:** `index.html`

Doctors log in using their registered credentials. Registration is admin-controlled.

---

#### POST `/api/doctor/auth/login`

**Request Body:**
```json
{
  "email": "doctor@hospital.com",
  "password": "securepass123"
}
```

**Expected Response `200`:**
```json
{
  "token": "jwt_token_here",
  "doctor": {
    "id": 1,
    "name": "Arjun Sharma",
    "specialty": "General Medicine",
    "email": "doctor@hospital.com",
    "hospital": "City Health Clinic"
  }
}
```

**Error `401`:**
```json
{ "message": "Invalid email or password" }
```

---

#### POST `/api/doctor/auth/logout`

Invalidate the token. No body required.

---

#### GET `/api/doctor/auth/me`

Returns the currently logged-in doctor's info.

---

### 2. Dashboard

**Page:** `dashboard.html`

Displays an overview of the doctor's practice activity for the day and month.

---

#### GET `/api/doctor/dashboard`

**Expected Response `200`:**
```json
{
  "stats": {
    "today_appointments": 8,
    "total_patients": 142,
    "pending_requests": 3,
    "prescriptions_month": 47,
    "revenue_month": 24500
  },
  "today_appointments": [
    {
      "id": 1,
      "patient_name": "Priya Mehta",
      "time": "09:00 AM",
      "type": "General consultation",
      "consultation_type": "in-clinic",
      "status": "confirmed"
    }
  ],
  "recent_patients": [
    {
      "id": 5,
      "name": "Priya Mehta",
      "age": 30,
      "last_visit": "2026-04-10"
    }
  ],
  "pending_lab_orders": [
    {
      "id": 2,
      "test_name": "Lipid Profile",
      "patient_name": "Rahul Verma",
      "ordered_at": "2026-04-11"
    }
  ]
}
```

---

### 3. Patient Management

**Page:** `patients.html`

The doctor can view all their patients, search/filter them, and access each patient's complete medical history.

---

#### GET `/api/doctor/patients`

**Query Parameters:**

| Param    | Type   | Description                                               |
|----------|--------|-----------------------------------------------------------|
| `search` | string | Search by patient name or phone                           |
| `sort`   | string | `recent`, `name_asc`, `name_desc`, `appointments`         |

**Response `200`:**
```json
{
  "patients": [
    {
      "id": 5,
      "name": "Priya Mehta",
      "email": "priya@email.com",
      "phone": "+91 9876543210",
      "age": 30,
      "gender": "Female",
      "blood_group": "B+",
      "weight": 68,
      "last_visit": "2026-04-10",
      "total_visits": 4
    }
  ]
}
```

---

#### GET `/api/doctor/patients/:id`

Full patient profile including medical history.

**Response `200`:**
```json
{
  "id": 5,
  "name": "Priya Mehta",
  "email": "priya@email.com",
  "phone": "+91 9876543210",
  "age": 30,
  "gender": "Female",
  "blood_group": "B+",
  "weight": 68,
  "height": 165,
  "allergies": "Penicillin",
  "conditions": "Mild asthma",
  "appointments": [
    {
      "id": 1,
      "date": "2026-04-10",
      "time": "10:00 AM",
      "status": "completed"
    }
  ],
  "prescriptions": [
    {
      "id": 1,
      "date": "2026-04-10",
      "diagnosis": "Viral Fever"
    }
  ],
  "records": [
    {
      "id": 1,
      "title": "CBC Report",
      "type": "Blood Test",
      "date": "2026-04-08"
    }
  ]
}
```

---

#### GET `/api/doctor/patients/:id/appointments`

All appointments for a specific patient with this doctor.

---

#### GET `/api/doctor/patients/:id/records`

All medical records for a specific patient.

---

#### GET `/api/doctor/patients/:id/prescriptions`

All prescriptions issued to a specific patient by this doctor.

---

### 4. Appointments

**Page:** `appointments.html`

Doctors manage incoming appointment requests and their scheduled consultations.

---

#### GET `/api/doctor/appointments`

**Query Parameters:**

| Param    | Type   | Values                                    |
|----------|--------|-------------------------------------------|
| `status` | string | `pending`, `confirmed`, `completed`, `cancelled` |
| `date`   | date   | Filter by specific date `YYYY-MM-DD`      |

**Response `200`:**
```json
{
  "appointments": [
    {
      "id": 1,
      "patient_name": "Priya Mehta",
      "patient_phone": "+91 9876543210",
      "date": "2026-04-15",
      "time": "10:00 AM",
      "consultation_type": "In-clinic",
      "reason": "Fever and headache",
      "status": "pending",
      "notes": null,
      "cancel_reason": null,
      "cancelled_by": null
    }
  ]
}
```

---

#### GET `/api/doctor/appointments/:id`

Returns full details of a single appointment.

---

#### PUT `/api/doctor/appointments/:id`

Update appointment status or add consultation notes.

**Request Body (status update):**
```json
{
  "status": "confirmed"
}
```

**Status values:** `confirmed`, `completed`, `cancelled`

**Request Body (add notes):**
```json
{
  "notes": "Patient has viral fever. Prescribed paracetamol."
}
```

---

#### PUT `/api/doctor/appointments/:id/reschedule`

**Request Body:**
```json
{
  "date": "2026-04-18",
  "time": "11:00 AM",
  "reason": "Doctor unavailable on original date"
}
```

**Expected Behavior:** Notify the patient via notification about the reschedule.

---

### 5. Prescriptions

**Page:** `prescriptions.html`

Doctors write and manage prescriptions for patients.

---

#### GET `/api/doctor/prescriptions`

**Query Parameters:** `?patient_id=&search=`

**Response `200`:**
```json
{
  "prescriptions": [
    {
      "id": 1,
      "patient_name": "Priya Mehta",
      "diagnosis": "Viral Fever",
      "date": "2026-04-10",
      "valid_until": "2026-05-10",
      "status": "active",
      "medicines": [
        { "name": "Paracetamol" }
      ]
    }
  ]
}
```

---

#### POST `/api/doctor/prescriptions`

Write a new prescription.

**Request Body:**
```json
{
  "patient_id": 5,
  "appointment_id": 1,
  "diagnosis": "Viral Fever with mild dehydration",
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "1 tablet",
      "frequency": "Twice daily",
      "duration": "5 days",
      "instructions": "After meals"
    },
    {
      "name": "ORS Sachets",
      "dosage": "1 sachet in 1L water",
      "frequency": "Thrice daily",
      "duration": "3 days",
      "instructions": "Mix well before drinking"
    }
  ],
  "instructions": "Rest for 3 days. Avoid cold food.",
  "valid_days": 30
}
```

**Response `201`:**
```json
{
  "id": 12,
  "message": "Prescription issued successfully"
}
```

**Expected Behavior:** Send a notification to the patient that a new prescription has been issued.

---

#### GET `/api/doctor/prescriptions/:id`

Full prescription details.

---

#### PUT `/api/doctor/prescriptions/:id`

Edit an existing prescription (only before patient views it, optionally).

---

#### DELETE `/api/doctor/prescriptions/:id`

Delete a prescription.

---

### 6. Medical Records

**Page:** `medical-records.html`

Doctors upload and manage medical records for their patients.

---

#### GET `/api/doctor/records`

**Query Parameters:** `?patient_id=&type=&search=`

**Response `200`:**
```json
{
  "records": [
    {
      "id": 1,
      "title": "Post-op Report - March 2026",
      "patient_name": "Priya Mehta",
      "type": "Surgery Report",
      "date": "2026-03-20",
      "notes": "Laparoscopic appendectomy, recovery normal",
      "file_url": "https://yourstorage.com/records/report.pdf"
    }
  ]
}
```

---

#### POST `/api/doctor/records`

Upload a record for a patient. Accepts `multipart/form-data`.

**Form Fields:**

| Field        | Type   | Required |
|--------------|--------|----------|
| `patient_id` | int    | Yes      |
| `title`      | string | Yes      |
| `type`       | string | Yes      |
| `date`       | date   | Yes      |
| `notes`      | string | No       |
| `file`       | file   | No       |

**Response `201`:**
```json
{ "id": 8, "message": "Record uploaded successfully" }
```

---

#### GET `/api/doctor/records/:id`

---

#### DELETE `/api/doctor/records/:id`

---

### 7. Lab Orders

**Page:** `lab-orders.html`

Doctors order diagnostic tests for patients and view results when ready.

---

#### GET `/api/doctor/lab-orders`

**Query Parameters:** `?patient_id=&status=pending|ready|all`

**Response `200`:**
```json
{
  "orders": [
    {
      "id": 1,
      "patient_name": "Priya Mehta",
      "tests": ["CBC (Complete Blood Count)", "Blood Glucose - Fasting"],
      "urgency": "routine",
      "status": "pending",
      "ordered_at": "2026-04-10",
      "has_abnormal": false
    }
  ]
}
```

---

#### POST `/api/doctor/lab-orders`

Order lab tests for a patient.

**Request Body:**
```json
{
  "patient_id": 5,
  "tests": [
    "CBC (Complete Blood Count)",
    "Lipid Profile",
    "HbA1c"
  ],
  "urgency": "routine",
  "notes": "Patient is diabetic, check for sugar levels too"
}
```

**Urgency values:** `routine`, `urgent`, `stat`

**Response `201`:**
```json
{ "id": 7, "message": "Lab order sent successfully" }
```

**Expected Behavior:** Send notification to patient to visit the lab.

---

#### GET `/api/doctor/lab-orders/:id`

Returns full lab order with results (if ready).

**Response `200`:**
```json
{
  "id": 7,
  "patient_name": "Priya Mehta",
  "tests": ["CBC"],
  "ordered_at": "2026-04-10",
  "lab_name": "Apollo Diagnostics",
  "status": "ready",
  "remarks": "WBC slightly elevated, recommend follow-up",
  "results": [
    {
      "test_name": "CBC",
      "parameters": [
        {
          "name": "Haemoglobin",
          "value": "14.2",
          "unit": "g/dL",
          "reference": "13.5–17.5",
          "flag": null
        },
        {
          "name": "WBC Count",
          "value": "11.8",
          "unit": "10³/µL",
          "reference": "4.5–11.0",
          "flag": "High"
        }
      ]
    }
  ]
}
```

---

#### PUT `/api/doctor/lab-orders/:id/results`

Enter results for a lab order (used by lab technician role, optionally).

**Request Body:**
```json
{
  "results": [
    {
      "test_name": "CBC",
      "parameters": [
        { "name": "Haemoglobin", "value": "14.2", "unit": "g/dL", "reference": "13.5–17.5", "flag": null }
      ]
    }
  ]
}
```

---

### 8. Schedule Management

**Page:** `schedule.html`

Doctors set their weekly availability and block dates for leaves/holidays.

---

#### GET `/api/doctor/schedule`

**Query Parameters:** `?month=2026-04`

**Response `200`:**
```json
{
  "availability": {
    "monday": { "active": true, "start": "09:00", "end": "17:00" },
    "tuesday": { "active": true, "start": "09:00", "end": "17:00" },
    "wednesday": { "active": true, "start": "09:00", "end": "17:00" },
    "thursday": { "active": true, "start": "09:00", "end": "17:00" },
    "friday": { "active": true, "start": "09:00", "end": "17:00" },
    "saturday": { "active": false },
    "sunday": { "active": false }
  },
  "slot_duration": 30,
  "max_appointments": 20,
  "blocked_dates": [
    { "id": 1, "date": "2026-04-25", "reason": "Vacation / Leave", "created_at": "2026-04-12" }
  ]
}
```

---

#### PUT `/api/doctor/schedule`

Update weekly availability settings.

**Request Body:**
```json
{
  "availability": {
    "monday": { "active": true, "start": "09:00", "end": "17:00" },
    "tuesday": { "active": true, "start": "09:00", "end": "17:00" },
    "saturday": { "active": true, "start": "10:00", "end": "13:00" },
    "sunday": { "active": false }
  },
  "slot_duration": 30,
  "max_appointments": 20
}
```

**Expected Behavior:** Regenerate available time slots based on new settings.

---

#### GET `/api/doctor/schedule/slots`

Returns time slots for a specific date (used in weekly view).

**Query Parameters:** `?date=2026-04-14`

**Response `200`:**
```json
{
  "slots": [
    { "time": "09:00 AM", "status": "free" },
    { "time": "09:30 AM", "status": "booked", "patient_name": "Priya Mehta" },
    { "time": "10:00 AM", "status": "booked", "patient_name": "Rahul Verma" },
    { "time": "10:30 AM", "status": "free" }
  ]
}
```

**Slot `status` values:** `free`, `booked`, `blocked`

---

#### POST `/api/doctor/schedule/block`

Block a specific date (leave, holiday, etc.).

**Request Body:**
```json
{
  "date": "2026-04-25",
  "reason": "Vacation / Leave"
}
```

**Expected Behavior:** Cancel all existing appointments on this date and notify patients.

---

#### DELETE `/api/doctor/schedule/block/:id`

Unblock a previously blocked date.

---

### 9. Billing

**Page:** `billing.html`

Doctors generate invoices for patients and track payment status.

---

#### GET `/api/doctor/billing`

**Query Parameters:** `?status=pending|paid|overdue&patient_id=&search=`

**Response `200`:**
```json
{
  "bills": [
    {
      "id": 1,
      "invoice_no": "INV-2026-001",
      "patient_name": "Priya Mehta",
      "description": "Consultation + ECG",
      "amount": 700,
      "date": "2026-04-10",
      "due_date": "2026-04-20",
      "status": "pending"
    }
  ]
}
```

---

#### POST `/api/doctor/billing`

Generate a new invoice for a patient.

**Request Body:**
```json
{
  "patient_id": 5,
  "appointment_id": 1,
  "items": [
    { "name": "Consultation Fee", "qty": 1, "amount": 500 },
    { "name": "ECG Test", "qty": 1, "amount": 200 }
  ],
  "tax_percent": 0,
  "due_date": "2026-04-20",
  "notes": "Payment due within 10 days"
}
```

**Response `201`:**
```json
{
  "id": 15,
  "invoice_no": "INV-2026-015",
  "total": 700,
  "message": "Invoice generated and sent to patient"
}
```

**Expected Behavior:** Send a notification to the patient about the new invoice.

---

#### GET `/api/doctor/billing/:id`

Returns full invoice details with line items.

---

#### PUT `/api/doctor/billing/:id/status`

Update payment status.

**Request Body:**
```json
{
  "status": "paid"
}
```

**Status values:** `pending`, `paid`, `overdue`

---

### 10. Profile

**Page:** `profile.html`

Doctors manage their professional profile visible to patients.

---

#### GET `/api/doctor/profile`

**Response `200`:**
```json
{
  "id": 1,
  "name": "Arjun Sharma",
  "email": "doctor@hospital.com",
  "phone": "+91 9876543210",
  "specialty": "General Medicine",
  "license_no": "MCI-12345",
  "experience": 8,
  "fee": 500,
  "qualifications": "MBBS, MD (Internal Medicine)",
  "hospital": "City Health Clinic",
  "address": "123 MG Road, Mumbai",
  "languages": "English, Hindi, Marathi",
  "bio": "Senior physician with 8 years of experience...",
  "visibility": "public"
}
```

---

#### PUT `/api/doctor/profile`

Update professional details. Any subset of fields may be sent.

**Request Body:**
```json
{
  "name": "Arjun Sharma",
  "phone": "+91 9876543210",
  "specialty": "General Medicine",
  "license_no": "MCI-12345",
  "experience": 8,
  "fee": 600,
  "qualifications": "MBBS, MD",
  "hospital": "City Health Clinic",
  "address": "123 MG Road, Mumbai",
  "languages": "English, Hindi",
  "bio": "Updated bio text here..."
}
```

---

#### PUT `/api/doctor/profile/password`

**Request Body:**
```json
{
  "current_password": "oldpass",
  "new_password": "newpass123"
}
```

---

### 11. Notifications

**Page:** `notifications.html`

Doctors receive alerts for appointment requests, lab results, patient activity, etc.

---

#### GET `/api/doctor/notifications`

**Response `200`:**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "appointment",
      "title": "New Appointment Request",
      "message": "Priya Mehta has requested an appointment on Apr 15 at 10:00 AM.",
      "is_read": false,
      "created_at": "2026-04-12T07:30:00Z"
    },
    {
      "id": 2,
      "type": "lab",
      "title": "Lab Results Available",
      "message": "CBC results for Rahul Verma are ready.",
      "is_read": false,
      "created_at": "2026-04-11T14:00:00Z"
    }
  ]
}
```

**Notification `type` values:** `appointment`, `lab`, `patient`, `billing`, `system`

---

#### PUT `/api/doctor/notifications/:id/read`

Mark a single notification as read.

---

#### PUT `/api/doctor/notifications/read-all`

Mark all notifications as read.

---

#### DELETE `/api/doctor/notifications/:id`

Delete a single notification.

---

### 12. Telemedicine

**Page:** `telemedicine.html`

Doctors schedule and conduct video consultations with patients.

---

#### GET `/api/doctor/telemedicine/sessions`

**Query Parameters:** `?status=scheduled|completed|cancelled`

**Response `200`:**
```json
{
  "sessions": [
    {
      "id": 1,
      "patient_name": "Priya Mehta",
      "scheduled_at": "2026-04-14T10:00:00Z",
      "duration_mins": 30,
      "status": "scheduled",
      "notes": "Prepare past reports"
    }
  ]
}
```

**Session `status` values:** `scheduled`, `live`, `completed`, `cancelled`

---

#### POST `/api/doctor/telemedicine/sessions`

Schedule a new video consultation.

**Request Body:**
```json
{
  "patient_id": 5,
  "appointment_id": 1,
  "scheduled_at": "2026-04-14T10:00:00Z",
  "duration_mins": 30,
  "notes": "Please bring your previous reports and medication list."
}
```

**Response `201`:**
```json
{
  "id": 3,
  "join_url": "https://meet.yourplatform.com/room/abc123",
  "message": "Session scheduled. Patient has been notified."
}
```

**Expected Behavior:**
- Generate a unique video call link (use any video API: Jitsi, Daily.co, Whereby, etc.)
- Send the link to the patient via notification
- Store the session with `scheduled` status

---

#### GET `/api/doctor/telemedicine/sessions/:id`

Returns session details including join URL and notes.

---

#### POST `/api/doctor/telemedicine/sessions/:id/join`

Called when the doctor clicks "Join Now". Returns the video call URL.

**Response `200`:**
```json
{
  "join_url": "https://meet.yourplatform.com/room/abc123",
  "patient_name": "Priya Mehta"
}
```

**Expected Behavior:** Update session status to `live`.

---

#### PUT `/api/doctor/telemedicine/sessions/:id`

Update session notes or follow-up after the call.

**Request Body:**
```json
{
  "notes": "Discussed lab results. Patient recovering well.",
  "followup": "1_month"
}
```

---

#### PUT `/api/doctor/telemedicine/sessions/:id/end`

End or cancel a session. Update status to `completed` or `cancelled`.

---

## General Error Format

All errors should follow this structure:

```json
{
  "message": "Human-readable error description"
}
```

| HTTP Code | Meaning                        |
|-----------|--------------------------------|
| `200`     | Success                        |
| `201`     | Created                        |
| `400`     | Bad request / validation error |
| `401`     | Unauthenticated                |
| `403`     | Forbidden                      |
| `404`     | Not found                      |
| `500`     | Internal server error          |

---

## Evaluation Criteria

| Criteria                          | Weight |
|-----------------------------------|--------|
| All 12 features working correctly | 40%    |
| API response structure accuracy   | 20%    |
| Authentication & security         | 15%    |
| Error handling                    | 10%    |
| Code quality & structure          | 10%    |
| Bonus: File uploads working       | 5%     |

---

## Notes for Participants

- **Do not modify** the frontend HTML/CSS/JS files
- The frontend uses `localStorage` to store the auth token under key `doctor_token` — your login endpoint **must** return a `token` field and the user object under key `doctor`
- All date fields should follow **ISO 8601** format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`
- Enable **CORS** on your backend — the frontend runs from a different origin
- File uploads use `multipart/form-data` — handle accordingly
- The **Telemedicine** feature requires integration with any third-party video calling API
- For **Schedule**, auto-generate time slots based on the doctor's availability settings and slot duration

---

*MediConnect Doctor Dashboard — BackForge Healthtech Competition*
