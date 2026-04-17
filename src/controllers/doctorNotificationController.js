const Notification = require('../models/Notification');
const { ok, fail } = require('../utils/respond');

async function listNotifications(req, res) {
  try {
    const notifs = await Notification.find({ doctorId: req.doctorId }).sort({ created_at: -1 }).lean();
    return ok(res, {
      notifications: notifs.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        is_read: n.is_read,
        created_at: n.created_at
      }))
    });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function markRead(req, res) {
  try {
    await Notification.updateOne(
      { _id: req.params.id, doctorId: req.doctorId },
      { $set: { is_read: true } }
    );
    return ok(res, { message: 'Marked read' });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function markAllRead(req, res) {
  try {
    await Notification.updateMany({ doctorId: req.doctorId, is_read: false }, { $set: { is_read: true } });
    return ok(res, { message: 'All marked read' });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

async function deleteNotification(req, res) {
  try {
    await Notification.deleteOne({ _id: req.params.id, doctorId: req.doctorId });
    return ok(res, { message: 'Deleted' });
  } catch (err) {
    return fail(res, err.message || 'Failed', 500);
  }
}

module.exports = { listNotifications, markRead, markAllRead, deleteNotification };
