import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const meetingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  serviceRequired: { type: String },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  meetingType: { type: String, default: 'Google Meet' },
  budget: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

const Meeting = createModel('Meeting', meetingSchema);
export default Meeting;
