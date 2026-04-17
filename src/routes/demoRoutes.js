const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const { resetAndSeedDemo } = require('../controllers/demoController');

router.use(authRequired);

// POST /api/demo/reset
router.post('/reset', requireRole('demo', 'admin'), resetAndSeedDemo);

module.exports = router;
