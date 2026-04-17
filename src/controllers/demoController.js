const Doctor = require('../models/Doctor');
const { ok, fail } = require('../utils/respond');
const { resetSeedData, ensureSeedData } = require('../utils/seed');

async function resetAndSeedDemo(req, res) {
  try {
    const doctor = await Doctor.findById(req.doctorId).lean();
    if (!doctor) return fail(res, 'Unauthorized', 401);

    // Safety guard: only allow demo doctor to reset demo data
    if (doctor.email !== 'doctor@demo.com') {
      return fail(res, 'Reset allowed only for demo account', 403);
    }

    await resetSeedData();
    await ensureSeedData();

    return ok(res, { message: 'Demo DB reset to seed data' });
  } catch (err) {
    return fail(res, err.message || 'Failed to reset demo DB', 500);
  }
}

module.exports = { resetAndSeedDemo };
