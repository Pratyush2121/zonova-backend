import mongoose from 'mongoose';
import { createModel } from './modelHelper.js';

const settingSchema = new mongoose.Schema({
  phone1: { type: String, default: '9324707261' },
  phone2: { type: String, default: '9335088060' },
  email: { type: String, default: 'zonovatechnologies@gmail.com' },
  address: { type: String, default: 'D WING 403 BHOOMI ACROPOLIS Virar Thane Maharashtra India 401303' },
  socialLinks: {
    linkedin: { type: String, default: 'https://linkedin.com/company/zonova' },
    twitter: { type: String, default: 'https://twitter.com/zonova' },
    facebook: { type: String, default: 'https://facebook.com/zonova' }
  }
}, { timestamps: true });

const Setting = createModel('Setting', settingSchema);
export default Setting;
