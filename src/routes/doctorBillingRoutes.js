const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const {
  listBills,
  createBill,
  getBill,
  updateBillStatus
} = require('../controllers/doctorBillingController');

router.use(authRequired);
router.get('/', listBills);
router.post('/', createBill);
router.get('/:id', getBill);
router.put('/:id/status', updateBillStatus);

module.exports = router;
