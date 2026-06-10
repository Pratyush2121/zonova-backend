import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 5 }
}, { timestamps: true });

const Testimonial = createModel('Testimonial', testimonialSchema);
export default Testimonial;
