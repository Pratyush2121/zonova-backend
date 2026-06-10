import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'SaaS', 'Mobile App', 'Web'
  clientGoals: { type: String },
  challenges: { type: String },
  solution: { type: String },
  screenshots: [{ type: String }],
  results: { type: String },
  testimonialText: { type: String },
  testimonialAuthor: { type: String },
  testimonialRole: { type: String },
  technologyStack: [{ type: String }],
  featured: { type: Boolean, default: false },
  link: { type: String }
}, { timestamps: true });

const Project = createModel('Project', projectSchema);
export default Project;
