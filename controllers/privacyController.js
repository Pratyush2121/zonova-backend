import Privacy from '../models/privacyModel.js';

export const getPrivacyContent = async (req, res) => {
  try {
    const { type } = req.params; // 'privacy' or 'terms'
    if (!type || !['privacy', 'terms'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid policy type' });
    }

    let policy = await Privacy.findOne({ type });

    if (!policy) {
      // Seed default policy if empty
      const defaultTitle = type === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions';
      const defaultContent = type === 'privacy' 
        ? '# Privacy Policy\n\nZonova Technologies is committed to protecting your privacy. This policy explains how we collect and use your data.\n\n## 1. Information Collection\nWe collect info when you contact us or apply for programs.' 
        : '# Terms and Conditions\n\nWelcome to Zonova Technologies. By using our website and services, you agree to these terms.\n\n## 1. User Account\nEnsure details provided are accurate.';
      
      policy = await Privacy.create({
        title: defaultTitle,
        content: defaultContent,
        type
      });
    }

    res.json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePrivacyContent = async (req, res) => {
  try {
    const { type } = req.params;
    const { title, content } = req.body;

    if (!type || !['privacy', 'terms'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid policy type' });
    }

    let policy = await Privacy.findOne({ type });
    let updated;

    if (!policy) {
      updated = await Privacy.create({ title, content, type });
    } else {
      updated = await Privacy.findByIdAndUpdate(policy._id || policy.id, { title, content }, { new: true });
    }

    res.json({ success: true, policy: updated, message: 'Policy document updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
