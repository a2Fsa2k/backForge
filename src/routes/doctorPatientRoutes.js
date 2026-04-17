const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { listPatients, getPatient } = require('../controllers/doctorPatientController');

router.use(authRequired);
router.get('/', listPatients);
router.get('/:id', getPatient);

module.exports = router;
