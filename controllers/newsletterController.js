import Newsletter from '../models/newsletterModel.js';
import Notification from '../models/notificationModel.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.status === 'subscribed') {
        return res.status(400).json({ success: false, message: 'You are already subscribed!' });
      } else {
        // re-subscribe
        const updated = await Newsletter.findByIdAndUpdate(existing._id || existing.id, { status: 'subscribed' }, { new: true });
        return res.json({ success: true, subscriber: updated, message: 'Subscribed successfully!' });
      }
    }

    const subscriber = await Newsletter.create({ email });

    // Create system notification for admin
    await Notification.create({
      title: 'New Newsletter Subscriber',
      message: `${email} has subscribed to the newsletter`,
      type: 'newsletter'
    });

    res.status(201).json({ success: true, subscriber, message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({});
    res.json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    const updated = await Newsletter.findByIdAndUpdate(subscriber._id || subscriber.id, { status: 'unsubscribed' }, { new: true });
    res.json({ success: true, subscriber: updated, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
