import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, required: true },
  desc: { type: String, required: true },
  requirements: { type: [String], required: true }
}, { timestamps: true });

const Job = createModel('Job', jobSchema);
export default Job;
