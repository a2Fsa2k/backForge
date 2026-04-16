# MediConnect — Doctor Dashboard
### BackForge Healthtech Competition

---

## Overview

This repo contains the complete **frontend** for a doctor-facing healthcare dashboard. Your task is to build a **backend** that powers it.

Every page, button, and form is already built. You just need to make the data flow correctly between the frontend and your server.

---

## Getting Started

1. Clone this repo and open `index.html` in a browser
2. Use the demo credentials below to explore all pages (no backend needed)
3. Open `js/app.js` and change the base URL to your server address
4. Build your backend to support each feature described below

---

## Demo Credentials

| Field    | Value           |
|----------|-----------------|
| Email    | doctor@demo.com |
| Password | demo123         |

---

## Features

---

### 1. Login

Doctors log in using their registered email and password. After a successful login, the frontend stores a token and uses it to identify the doctor on all future requests.

Doctors cannot self-register — accounts are pre-created (by an admin or seeded in the database).

---

### 2. Dashboard

After logging in, doctors land on a summary page that shows:
- Total patients, today's appointments, pending lab orders, and monthly revenue
- Today's appointment schedule with patient names and times
- Recent patients they have seen
- Pending lab orders awaiting results
- Quick action buttons to write a prescription, order a lab test, or view the schedule

---

### 3. Patient Management

Doctors can view a list of all patients they have treated or have appointments with.

They can search and sort the list. Clicking on a patient opens a full profile showing the patient's personal details, appointment history, prescriptions, and medical records — all in one place.

---

### 4. Appointments

Doctors can view their appointments grouped into tabs — Pending (awaiting confirmation), Confirmed (accepted), Completed, and Cancelled.

For pending appointments, doctors can accept or reject the request. For confirmed ones, they can reschedule (provide a new date, time, and reason) or mark them as complete after the visit. They can add notes to any appointment.

---

### 5. Prescriptions

Doctors can write prescriptions for their patients. Each prescription includes the diagnosis, one or more medicines (with name, dosage, frequency, and duration), special instructions, and how many days the prescription is valid for.

Doctors can view all prescriptions they have issued, search by patient name, and delete prescriptions if needed.

---

### 6. Medical Records

Doctors can upload medical documents for their patients — such as reports, scans, or discharge summaries.

They can view all records, filter by patient or document type, and delete records. Each record is linked to a specific patient.

---

### 7. Lab Orders

Doctors can order diagnostic tests for patients by selecting from a list of common tests or adding custom ones. They can mark an order as urgent and add notes for the lab.

Orders are shown in tabs — Pending (waiting for results) and Ready (results available).

When results arrive, doctors can view each test parameter, its value, and whether it falls within the normal range.

---

### 8. Schedule Management

Doctors can view their weekly schedule as a calendar — each day shows time slots that are free, booked with a patient, or manually blocked.

They can set their working hours and available days. They can also block specific dates (e.g., for leave) with a reason, and remove blocks when no longer needed.

---

### 9. Billing

Doctors can generate invoices for patients after a consultation. Each invoice can have multiple line items (e.g., consultation fee, procedure cost, test charges).

They can view all invoices, filter by status (paid or unpaid), and mark invoices as paid once payment is received.

---

### 10. Profile

Doctors can view and update their professional profile — including their name, phone number, specialty, consultation fee, hospital name, medical license number, and a professional bio.

They can also change their account password. The password change requires confirming their current password first.

---

### 11. Notifications

Doctors receive alerts for important events — such as a new appointment request from a patient, an appointment cancellation, lab results becoming available, or a payment received.

Notifications are shown as unread until dismissed. Doctors can mark individual notifications as read, mark all as read at once, or delete them. Clicking a notification takes them to the relevant page.

---

### 12. Telemedicine

Doctors can schedule and conduct video consultations with patients online.

They can view upcoming sessions, see any sessions that are currently live, and review past completed sessions.

When it is time for a session, the doctor can click "Join Now" — the backend provides a link to the video call. After the session, the doctor can mark it as ended and add session notes.

---

## Rules

- The frontend sends a token with every request after login — your backend must validate it
- Enable CORS on your server so the frontend can communicate with it
- For medical records upload, your backend must accept file uploads
- When something goes wrong, return a clear error message explaining what failed

---

## Evaluation Criteria

| Area                                   | Weight |
|----------------------------------------|--------|
| All 12 features working correctly      | 40%    |
| Login and authentication working       | 20%    |
| Correct data returned for each feature | 20%    |
| Proper error handling                  | 10%    |
| Clean and readable code                | 10%    |

---

*MediConnect Doctor Dashboard — BackForge Healthtech Competition*
