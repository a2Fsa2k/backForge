const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  listBillingSchema,
  createInvoiceSchema,
  getInvoiceSchema,
  updateInvoiceStatusSchema
} = require('../validators/billingSchemas');
const {
  listBills,
  createBill,
  getBill,
  updateBillStatus
} = require('../controllers/doctorBillingController');

router.use(authRequired);
router.get('/', validate(listBillingSchema), listBills);
router.post('/', validate(createInvoiceSchema), createBill);
router.get('/:id', validate(getInvoiceSchema), getBill);
router.put('/:id/status', validate(updateInvoiceStatusSchema), updateBillStatus);

module.exports = router;
