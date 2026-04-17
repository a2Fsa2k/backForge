const Doctor = require('../models/Doctor');
const { ok, fail } = require('../utils/respond');

async function getProfile(req, res) {
  try {
    const d = await Doctor.findById(req.doctorId).lean();
    if (!d) return fail(res, 'Doctor not found', 404);
    return ok(res, {
      id: d._id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      specialty: d.specialty,
      bio: d.bio,
      fee: d.fee,
      license_no: d.license_no,
      hospital: d.hospital,
      address: d.address,
      experience: d.experience,
      languages: d.languages,
      qualifications: d.qualifications
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function updateProfile(req, res) {
  try {
    const d = await Doctor.findById(req.doctorId);
    if (!d) return fail(res, 'Doctor not found', 404);

    const fields = [
      'name',
      'phone',
      'specialty',
      'bio',
      'fee',
      'license_no',
      'hospital',
      'address',
      'experience',
      'languages',
      'qualifications'
    ];

    for (const f of fields) {
      if (req.body && Object.prototype.hasOwnProperty.call(req.body, f)) {
        d[f] = req.body[f];
      }
    }

    await d.save();
    return ok(res, { message: 'Updated', doctor: { id: d._id } });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { getProfile, updateProfile };
