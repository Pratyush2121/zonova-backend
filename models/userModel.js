import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'admin' }
}, { timestamps: true });

const User = createModel('User', userSchema);
export default User;
