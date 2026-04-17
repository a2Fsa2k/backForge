const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { updateProfileSchema } = require('../validators/profileSchemas');
const { getProfile, updateProfile } = require('../controllers/doctorProfileController');

router.use(authRequired);
router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);

module.exports = router;
