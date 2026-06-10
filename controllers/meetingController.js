import Meeting from '../models/meetingModel.js';
import Notification from '../models/notificationModel.js';

export const bookMeeting = async (req, res) => {
  try {
    const { fullName, email, phone, company, serviceRequired, preferredDate, preferredTime, meetingType, budget, message } = req.body;

    if (!fullName || !email || !preferredDate || !preferredTime) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, date and time slot' });
    }

    // Check if slot is already booked
    const existingBooking = await Meeting.findOne({ preferredDate, preferredTime, status: 'approved' });
    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked. Please choose another date or time.' });
    }

    const meeting = await Meeting.create({
      fullName,
      email,
      phone,
      company,
      serviceRequired,
      preferredDate,
      preferredTime,
      meetingType: meetingType || 'Google Meet',
      budget,
      message
    });

    // Create system notification for admin
    await Notification.create({
      title: 'New Meeting Booking Request',
      message: `${fullName} has scheduled a ${meetingType || 'Google Meet'} for ${preferredDate} at ${preferredTime}`,
      type: 'meeting'
    });

    res.status(201).json({ success: true, meeting, message: 'Meeting scheduled successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const meetings = await Meeting.find(filter);
    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMeetingStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting booking not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await Meeting.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, meeting: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting booking not found' });
    }
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Meeting booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
