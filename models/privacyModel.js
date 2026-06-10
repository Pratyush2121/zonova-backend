import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const privacySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['privacy', 'terms'], required: true, unique: true }
}, { timestamps: true });

const Privacy = createModel('Privacy', privacySchema);
export default Privacy;
