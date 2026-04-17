const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { resetAndSeedDemo } = require('../controllers/demoController');

router.use(authRequired);

// POST /api/demo/reset
router.post('/reset', resetAndSeedDemo);

module.exports = router;
