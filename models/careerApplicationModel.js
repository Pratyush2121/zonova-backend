import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const careerApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ['applied', 'reviewing', 'interviewing', 'offered', 'rejected'], default: 'applied' }
}, { timestamps: true });

const CareerApplication = createModel('CareerApplication', careerApplicationSchema);
export default CareerApplication;
