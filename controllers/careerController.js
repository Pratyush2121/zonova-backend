import CareerApplication from '../models/careerApplicationModel.js';
import Notification from '../models/notificationModel.js';

export const applyForJob = async (req, res) => {
  try {
    const { fullName, email, phone, position, coverLetter } = req.body;

    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({ success: false, message: 'Please fill all required details' });
    }

    let resumeUrl = '';
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.resumeUrl) {
      resumeUrl = req.body.resumeUrl;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload your resume' });
    }

    const application = await CareerApplication.create({
      fullName,
      email,
      phone,
      position,
      resumeUrl,
      coverLetter
    });

    // Create system notification for admin
    await Notification.create({
      title: 'New Job Application',
      message: `${fullName} has applied for the ${position} position`,
      type: 'career'
    });

    res.status(201).json({ success: true, application, message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCareerApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const applications = await CareerApplication.find(filter);
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCareerApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const application = await CareerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const updated = await CareerApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, application: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCareerApplication = async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    await CareerApplication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
