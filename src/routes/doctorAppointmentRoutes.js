const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  listAppointmentsSchema,
  updateAppointmentSchema,
  rescheduleSchema
} = require('../validators/appointmentSchemas');

// Local id param validation for GET /:id (non-breaking, avoids expanding shared schema file)
const { Joi } = require('../middlewares/validate');
const getAppointmentSchema = { params: Joi.object({ id: Joi.string().length(24).hex().required() }) };
const {
  listAppointments,
  getAppointment,
  updateAppointment,
  reschedule
} = require('../controllers/doctorAppointmentController');

router.use(authRequired);
router.get('/', validate(listAppointmentsSchema), listAppointments);
router.get('/:id', validate(getAppointmentSchema), getAppointment);
router.put('/:id', validate(updateAppointmentSchema), updateAppointment);
router.put('/:id/reschedule', validate(rescheduleSchema), reschedule);

module.exports = router;
