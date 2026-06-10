import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' }
}, { timestamps: true });

const FAQ = createModel('FAQ', faqSchema);
export default FAQ;
