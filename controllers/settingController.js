import SettingModel from '../models/settingModel.js';
const Setting = (SettingModel && SettingModel.default) ? (SettingModel.default.default || SettingModel.default) : SettingModel;

export const getSettings = async (req, res) => {
  try {
    let settingsList = await Setting.find({});
    let settings = settingsList[0];

    if (!settings) {
      // Seed default settings if empty
      settings = await Setting.create({
        phone1: '9324707261',
        phone2: '9335088060',
        email: 'zonovatechnologies@gmail.com',
        address: 'D WING 403 BHOOMI ACROPOLIS Virar Thane Maharashtra India 401303',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/zonova',
          twitter: 'https://twitter.com/zonova',
          facebook: 'https://facebook.com/zonova'
        }
      });
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settingsList = await Setting.find({});
    let settings = settingsList[0];

    const { phone1, phone2, email, address, linkedin, twitter, facebook } = req.body;

    const updateData = {
      phone1: phone1 !== undefined ? phone1 : settings?.phone1 || '9324707261',
      phone2: phone2 !== undefined ? phone2 : settings?.phone2 || '9335088060',
      email: email !== undefined ? email : settings?.email || 'zonovatechnologies@gmail.com',
      address: address !== undefined ? address : settings?.address || 'D WING 403 BHOOMI ACROPOLIS Virar Thane Maharashtra India 401303',
      socialLinks: {
        linkedin: linkedin !== undefined ? linkedin : settings?.socialLinks?.linkedin || '',
        twitter: twitter !== undefined ? twitter : settings?.socialLinks?.twitter || '',
        facebook: facebook !== undefined ? facebook : settings?.socialLinks?.facebook || ''
      }
    };

    let updated;
    if (!settings) {
      updated = await Setting.create(updateData);
    } else {
      updated = await Setting.findByIdAndUpdate(settings._id || settings.id, updateData, { new: true });
    }

    res.json({ success: true, settings: updated, message: 'Settings updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
