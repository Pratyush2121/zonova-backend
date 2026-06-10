import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  serviceInterestedIn: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'in-progress', 'contacted', 'qualified', 'closed'], default: 'new' }
}, { timestamps: true });

const Lead = createModel('Lead', leadSchema);
export default Lead;
