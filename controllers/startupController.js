import StartupApplication from '../models/startupApplicationModel.js';
import Notification from '../models/notificationModel.js';

export const createStartupApplication = async (req, res) => {
  try {
    const { founderName, startupName, email, phoneNumber, industry, startupStage, fundingStatus, startupIdea, budgetRange, requiredServices, expectedTimeline } = req.body;

    if (!founderName || !startupName || !email || !phoneNumber || !startupIdea) {
      return res.status(400).json({ success: false, message: 'Please provide founder name, startup name, email, phone, and idea description' });
    }

    const services = Array.isArray(requiredServices) 
      ? requiredServices 
      : (requiredServices ? requiredServices.split(',').map(s => s.trim()) : []);

    const application = await StartupApplication.create({
      founderName,
      startupName,
      email,
      phoneNumber,
      industry,
      startupStage,
      fundingStatus,
      startupIdea,
      budgetRange,
      requiredServices: services,
      expectedTimeline
    });

    // Create system notification for admin
    await Notification.create({
      title: 'New Startup Program Application',
      message: `${founderName} has applied for partnership with ${startupName}`,
      type: 'startup'
    });

    res.status(201).json({ success: true, application, message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStartupApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const applications = await StartupApplication.find(filter);
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStartupApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const application = await StartupApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const updated = await StartupApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, application: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStartupApplication = async (req, res) => {
  try {
    const application = await StartupApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    await StartupApplication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
