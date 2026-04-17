const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');
const { ok, fail } = require('../utils/respond');

function calcAmount(items, taxPercent) {
  const subtotal = items.reduce((s, it) => s + (Number(it.amount) || 0) * (Number(it.qty) || 1), 0);
  const tax = subtotal * ((Number(taxPercent) || 0) / 100);
  return Math.round((subtotal + tax) * 100) / 100;
}

async function listBills(req, res) {
  try {
    const status = (req.query.status || '').toString();
    const patientId = (req.query.patient_id || '').toString();
    const search = (req.query.search || '').toString().trim();

    const q = { doctorId: req.doctorId };
    if (status) q.status = status;
    if (patientId) q.patientId = patientId;
    if (search) {
      q.$or = [
        { patient_name: { $regex: search, $options: 'i' } },
        { invoice_no: { $regex: search, $options: 'i' } }
      ];
    }

    const bills = await Invoice.find(q).sort({ date: -1 }).lean();

    return ok(res, {
      bills: bills.map(b => ({
        id: b._id,
        invoice_no: b.invoice_no,
        patient_name: b.patient_name,
        description: b.notes || null,
        amount: b.amount,
        due_date: b.due_date,
        date: b.date,
        status: b.status,
        items: b.items
      }))
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function createBill(req, res) {
  try {
    const { patient_id, appointment_id, items, due_date, tax_percent, notes } = req.body || {};

    if (!patient_id) return fail(res, 'patient_id is required', 400);
    if (!Array.isArray(items) || items.length === 0) return fail(res, 'items are required', 400);

    const cleanedItems = items
      .map(i => ({
        name: i.name,
        qty: parseInt(i.qty, 10) || 1,
        amount: parseFloat(i.amount) || 0
      }))
      .filter(i => i.name);

    if (!cleanedItems.length) return fail(res, 'At least one valid item is required', 400);

    const patient = await Patient.findOne({ _id: patient_id, doctorId: req.doctorId }).lean();
    if (!patient) return fail(res, 'Patient not found', 404);

    const amount = calcAmount(cleanedItems, tax_percent);

    const inv = await Invoice.create({
      doctorId: req.doctorId,
      patientId: patient._id,
      appointmentId: appointment_id || null,
      patient_name: patient.name,
      invoice_no: `INV-${Date.now()}`,
      items: cleanedItems,
      tax_percent: parseFloat(tax_percent) || 0,
      notes: notes || null,
      amount,
      due_date: due_date ? new Date(due_date) : null,
      status: 'pending'
    });

    return ok(
      res,
      { id: inv._id, invoice_no: inv.invoice_no, amount: inv.amount, status: inv.status, message: 'Created' },
      201
    );
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function getBill(req, res) {
  try {
    const b = await Invoice.findOne({ _id: req.params.id, doctorId: req.doctorId }).lean();
    if (!b) return fail(res, 'Invoice not found', 404);

    return ok(res, {
      id: b._id,
      invoice_no: b.invoice_no,
      patient_name: b.patient_name,
      items: b.items,
      amount: b.amount,
      due_date: b.due_date,
      date: b.date,
      status: b.status
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function updateBillStatus(req, res) {
  try {
    const { status } = req.body || {};
    if (!status) return fail(res, 'status is required', 400);
    if (!['pending', 'paid', 'overdue'].includes(status)) return fail(res, 'Invalid status', 400);

    const b = await Invoice.findOne({ _id: req.params.id, doctorId: req.doctorId });
    if (!b) return fail(res, 'Invoice not found', 404);

    // Minimal state machine per requirement
    if (b.status === 'pending' && status === 'paid') b.status = 'paid';
    else if (b.status === status) {
      // no-op
    } else {
      // keep simple: allow pending<->overdue server choice, but do not block frontend
      b.status = status;
    }

    await b.save();
    return ok(res, { message: 'Updated', bill: { id: b._id, status: b.status } });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { listBills, createBill, getBill, updateBillStatus };
