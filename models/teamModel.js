import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String },
  linkedin: { type: String },
  twitter: { type: String }
}, { timestamps: true });

const Team = createModel('Team', teamSchema);
export default Team;
