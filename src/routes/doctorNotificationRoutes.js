const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { markReadSchema, deleteSchema } = require('../validators/notificationSchemas');
const {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification
} = require('../controllers/doctorNotificationController');

router.use(authRequired);
router.get('/', listNotifications);
router.put('/:id/read', validate(markReadSchema), markRead);
router.put('/read-all', markAllRead);
router.delete('/:id', validate(deleteSchema), deleteNotification);

module.exports = router;
