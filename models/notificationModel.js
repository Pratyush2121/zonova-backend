import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['lead', 'meeting', 'startup', 'career', 'contact', 'newsletter'], required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = createModel('Notification', notificationSchema);
export default Notification;
