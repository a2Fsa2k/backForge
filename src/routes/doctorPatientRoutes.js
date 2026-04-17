const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { listPatientsSchema, getPatientSchema } = require('../validators/patientSchemas');
const { listPatients, getPatient } = require('../controllers/doctorPatientController');

router.use(authRequired);
router.get('/', validate(listPatientsSchema), listPatients);
router.get('/:id', validate(getPatientSchema), getPatient);

module.exports = router;
