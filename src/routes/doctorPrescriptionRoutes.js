const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const {
  listPrescriptions,
  createPrescription,
  getPrescription,
  deletePrescription
} = require('../controllers/doctorPrescriptionController');

router.use(authRequired);
router.get('/', listPrescriptions);
router.post('/', createPrescription);
router.get('/:id', getPrescription);
router.delete('/:id', deletePrescription);

module.exports = router;
