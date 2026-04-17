const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification
} = require('../controllers/doctorNotificationController');

router.use(authRequired);
router.get('/', listNotifications);
router.put('/:id/read', markRead);
router.put('/read-all', markAllRead);
router.delete('/:id', deleteNotification);

module.exports = router;
