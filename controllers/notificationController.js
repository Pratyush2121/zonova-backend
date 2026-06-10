import NotificationModel from '../models/notificationModel.js';
const Notification = (NotificationModel && NotificationModel.default) ? (NotificationModel.default.default || NotificationModel.default) : NotificationModel;

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const unread = await Notification.find({ read: false });
    
    // update all
    const promises = unread.map(notif => 
      Notification.findByIdAndUpdate(notif._id || notif.id, { read: true })
    );
    await Promise.all(promises);

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
