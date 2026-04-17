const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const {
  listAppointments,
  getAppointment,
  updateAppointment,
  reschedule
} = require('../controllers/doctorAppointmentController');

router.use(authRequired);
router.get('/', listAppointments);
router.get('/:id', getAppointment);
router.put('/:id', updateAppointment);
router.put('/:id/reschedule', reschedule);

module.exports = router;
