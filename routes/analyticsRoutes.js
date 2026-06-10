import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import LeadModel from '../models/leadModel.js';
import MeetingModel from '../models/meetingModel.js';
import ProjectModel from '../models/projectModel.js';
import BlogModel from '../models/blogModel.js';
import StartupApplicationModel from '../models/startupApplicationModel.js';
import CareerApplicationModel from '../models/careerApplicationModel.js';
import NewsletterModel from '../models/newsletterModel.js';

const Lead = (LeadModel && LeadModel.default) ? (LeadModel.default.default || LeadModel.default) : LeadModel;
const Meeting = (MeetingModel && MeetingModel.default) ? (MeetingModel.default.default || MeetingModel.default) : MeetingModel;
const Project = (ProjectModel && ProjectModel.default) ? (ProjectModel.default.default || ProjectModel.default) : ProjectModel;
const Blog = (BlogModel && BlogModel.default) ? (BlogModel.default.default || BlogModel.default) : BlogModel;
const StartupApplication = (StartupApplicationModel && StartupApplicationModel.default) ? (StartupApplicationModel.default.default || StartupApplicationModel.default) : StartupApplicationModel;
const CareerApplication = (CareerApplicationModel && CareerApplicationModel.default) ? (CareerApplicationModel.default.default || CareerApplicationModel.default) : CareerApplicationModel;
const Newsletter = (NewsletterModel && NewsletterModel.default) ? (NewsletterModel.default.default || NewsletterModel.default) : NewsletterModel;

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalMeetings = await Meeting.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalStartupApps = await StartupApplication.countDocuments();
    const totalJobApps = await CareerApplication.countDocuments();
    const totalSubscribers = await Newsletter.countDocuments({ status: 'subscribed' });

    // Mock some growth history for chart data in admin panel
    // Monthly growth stats
    const monthlyGrowth = [
      { name: 'Jan', Leads: Math.round(totalLeads * 0.4), Meetings: Math.round(totalMeetings * 0.3), Startups: Math.round(totalStartupApps * 0.2) },
      { name: 'Feb', Leads: Math.round(totalLeads * 0.6), Meetings: Math.round(totalMeetings * 0.5), Startups: Math.round(totalStartupApps * 0.4) },
      { name: 'Mar', Leads: Math.round(totalLeads * 0.75), Meetings: Math.round(totalMeetings * 0.7), Startups: Math.round(totalStartupApps * 0.65) },
      { name: 'Apr', Leads: Math.round(totalLeads * 0.85), Meetings: Math.round(totalMeetings * 0.8), Startups: Math.round(totalStartupApps * 0.8) },
      { name: 'May', Leads: Math.round(totalLeads * 0.95), Meetings: Math.round(totalMeetings * 0.9), Startups: Math.round(totalStartupApps * 0.9) },
      { name: 'Jun', Leads: totalLeads, Meetings: totalMeetings, Startups: totalStartupApps }
    ];

    res.json({
      success: true,
      stats: {
        totalLeads,
        totalMeetings,
        totalProjects,
        totalBlogs,
        totalStartupApps,
        totalJobApps,
        totalSubscribers
      },
      monthlyGrowth
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
