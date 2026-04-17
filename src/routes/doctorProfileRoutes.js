const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { getProfile, updateProfile } = require('../controllers/doctorProfileController');

router.use(authRequired);
router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
