import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' }
}, { timestamps: true });

const Newsletter = createModel('Newsletter', newsletterSchema);
export default Newsletter;
