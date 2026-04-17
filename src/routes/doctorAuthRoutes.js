const router = require('express').Router();
const { login, me, logout } = require('../controllers/doctorAuthController');
const { authRequired } = require('../middlewares/auth');

router.post('/login', login);
router.post('/logout', authRequired, logout);
router.get('/me', authRequired, me);

module.exports = router;
