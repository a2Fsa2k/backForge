const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  listPrescriptionsSchema,
  createPrescriptionSchema,
  getPrescriptionSchema,
  deletePrescriptionSchema
} = require('../validators/prescriptionSchemas');
const {
  listPrescriptions,
  createPrescription,
  getPrescription,
  deletePrescription
} = require('../controllers/doctorPrescriptionController');

router.use(authRequired);
router.get('/', validate(listPrescriptionsSchema), listPrescriptions);
router.post('/', validate(createPrescriptionSchema), createPrescription);
router.get('/:id', validate(getPrescriptionSchema), getPrescription);
router.delete('/:id', validate(deletePrescriptionSchema), deletePrescription);

module.exports = router;
