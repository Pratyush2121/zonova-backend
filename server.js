import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { seedAdmin } from './controllers/authController.js';
import { seedJobs } from './controllers/jobController.js';
import { seedBlogs } from './controllers/blogController.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import startupRoutes from './routes/startupRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import privacyRoutes from './routes/privacyRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // allow local image loading
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (Disabled to prevent 429 errors on multi-resource dashboard load)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 200 : 10000, // Limit each IP to 200 requests in production, 10000 in dev
//   message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
// });
// app.use('/api/', limiter);


// Setup static folders
const getCurrentDir = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
};
const uploadDir = path.join(getCurrentDir(), 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory (this is normal in serverless/read-only runtimes):", error.message);
}
app.use('/uploads', express.static(uploadDir));

// Helper to handle ESM/CommonJS default export interop for routes
const getRouter = (routeModule) => {
  if (routeModule && typeof routeModule === 'object' && routeModule.default) {
    return routeModule.default;
  }
  return routeModule;
};

// API Routes Registration
app.use('/api/auth', getRouter(authRoutes));
app.use('/api/projects', getRouter(projectRoutes));
app.use('/api/blogs', getRouter(blogRoutes));
app.use('/api/leads', getRouter(leadRoutes));
app.use('/api/meetings', getRouter(meetingRoutes));
app.use('/api/startups', getRouter(startupRoutes));
app.use('/api/careers', getRouter(careerRoutes));
app.use('/api/team', getRouter(teamRoutes));
app.use('/api/testimonials', getRouter(testimonialRoutes));
app.use('/api/settings', getRouter(settingRoutes));
app.use('/api/faqs', getRouter(faqRoutes));
app.use('/api/privacy', getRouter(privacyRoutes));
app.use('/api/newsletter', getRouter(newsletterRoutes));
app.use('/api/notifications', getRouter(notificationRoutes));
app.use('/api/analytics', getRouter(analyticsRoutes));
app.use('/api/jobs', getRouter(jobRoutes));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Zonova Technologies API Server is running smoothly.' });
});

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server & Connect Database
let dbConnected = false;
export const initApp = async () => {
  if (!dbConnected) {
    await connectDB();
    await seedAdmin();
    await seedJobs();
    await seedBlogs();
    dbConnected = true;
  }
};

const isNetlify = process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT;

if (!isNetlify) {
  initApp().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  });
}

app.initApp = initApp;
export default app;
