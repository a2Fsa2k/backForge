const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { dashboard } = require('../controllers/doctorDashboardController');

router.use(authRequired);
router.get('/', dashboard);

module.exports = router;
