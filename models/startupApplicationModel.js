import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const startupApplicationSchema = new mongoose.Schema({
  founderName: { type: String, required: true },
  startupName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  industry: { type: String },
  startupStage: { type: String },
  fundingStatus: { type: String },
  startupIdea: { type: String, required: true },
  budgetRange: { type: String },
  requiredServices: [{ type: String }],
  expectedTimeline: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'contacted', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

const StartupApplication = createModel('StartupApplication', startupApplicationSchema);
export default StartupApplication;
