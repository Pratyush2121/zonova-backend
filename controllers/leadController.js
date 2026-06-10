import LeadModel from '../models/leadModel.js';
const Lead = (LeadModel && LeadModel.default) ? (LeadModel.default.default || LeadModel.default) : LeadModel;
import NotificationModel from '../models/notificationModel.js';
const Notification = (NotificationModel && NotificationModel.default) ? (NotificationModel.default.default || NotificationModel.default) : NotificationModel;

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, serviceInterestedIn, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required fields' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      serviceInterestedIn,
      message
    });

    // Create system notification for admin
    await Notification.create({
      title: 'New Lead Submission',
      message: `${name} from ${company || 'Individual'} is interested in ${serviceInterestedIn || 'General Services'}`,
      type: 'lead'
    });

    res.status(201).json({ success: true, lead, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter);
    res.json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, lead: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Leads to CSV
export const exportLeadsCSV = async (req, res) => {
  try {
    const leads = await Lead.find({});
    
    // Create CSV Header
    let csvContent = 'ID,Name,Email,Phone,Company,Service,Message,Status,Date\n';
    
    // Add data rows
    leads.forEach((lead) => {
      const cleanMessage = lead.message ? lead.message.replace(/"/g, '""').replace(/\n/g, ' ') : '';
      csvContent += `"${lead._id || lead.id}","${lead.name}","${lead.email}","${lead.phone || ''}","${lead.company || ''}","${lead.serviceInterestedIn || ''}","${cleanMessage}","${lead.status}","${lead.createdAt}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('zonova_leads.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
