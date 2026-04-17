const router = require('express').Router();
const { login, me, logout } = require('../controllers/doctorAuthController');
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { loginSchema } = require('../validators/doctorAuthSchemas');

router.post('/login', validate(loginSchema), login);
router.post('/logout', authRequired, logout);
router.get('/me', authRequired, me);

module.exports = router;
