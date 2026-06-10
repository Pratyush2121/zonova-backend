import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  featuredImage: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  metaTitle: { type: String },
  metaDescription: { type: String },
  readTime: { type: String }
}, { timestamps: true });

const Blog = createModel('Blog', blogSchema);
export default Blog;
