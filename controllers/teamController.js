import Team from '../models/teamModel.js';

export const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.find({});
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, linkedin, twitter } = req.body;

    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and role are required fields' });
    }

    let image = '/uploads/team-placeholder.png';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const member = await Team.create({
      name,
      role,
      image,
      bio,
      linkedin,
      twitter
    });

    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    const { name, role, bio, linkedin, twitter } = req.body;

    let image = member.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const updated = await Team.findByIdAndUpdate(req.params.id, {
      name: name || member.name,
      role: role || member.role,
      image,
      bio: bio || member.bio,
      linkedin: linkedin !== undefined ? linkedin : member.linkedin,
      twitter: twitter !== undefined ? twitter : member.twitter
    }, { new: true });

    res.json({ success: true, member: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
