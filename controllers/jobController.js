import Job from '../models/jobModel.js';

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, location, type, salary, desc, requirements } = req.body;

    if (!title || !location || !type || !salary || !desc || !requirements) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    const reqArray = Array.isArray(requirements) 
      ? requirements 
      : requirements.split(',').map(r => r.trim()).filter(Boolean);

    const job = await Job.create({
      title,
      location,
      type,
      salary,
      desc,
      requirements: reqArray
    });

    res.status(201).json({ success: true, job, message: 'Job opportunity created successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { title, location, type, salary, desc, requirements } = req.body;
    
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opportunity not found' });
    }

    const reqArray = Array.isArray(requirements)
      ? requirements
      : (requirements ? requirements.split(',').map(r => r.trim()).filter(Boolean) : job.requirements);

    const updated = await Job.findByIdAndUpdate(req.params.id, {
      title: title || job.title,
      location: location || job.location,
      type: type || job.type,
      salary: salary || job.salary,
      desc: desc || job.desc,
      requirements: reqArray
    }, { new: true });

    res.json({ success: true, job: updated, message: 'Job opportunity updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opportunity not found' });
    }
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedJobs = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.create({
        title: 'Senior MERN Developer',
        location: 'Mumbai, India (Hybrid)',
        type: 'Full-Time',
        salary: '₹12L - ₹18L per annum',
        desc: 'We are seeking a senior full-stack engineer to lead development of MVP prototypes and SaaS dashboard products. You will define engineering architectures, write clean APIs, and sync localized databases.',
        requirements: [
          '5+ years experience in React, Node.js, Express, and MongoDB.',
          'Expertise in Redux, Tailwind CSS, and cloud hosting APIs.',
          'Proven track record of building and launching functional software products.'
        ]
      });
      await Job.create({
        title: 'Growth Product Manager',
        location: 'Remote, India',
        type: 'Full-Time',
        salary: '₹8L - ₹14L per annum',
        desc: 'Looking for a product manager with growth marketing DNA. You will consult founders on MVP roadmap validation, write sprint stories, and track product analytics conversion loops.',
        requirements: [
          '3+ years experience managing SaaS or mobile app life-cycles.',
          'Deep understanding of Mixpanel, Google Analytics, and A/B sprint loops.',
          'Excellent customer validation and pitch consulting communication.'
        ]
      });
      await Job.create({
        title: 'Performance Marketing Lead',
        location: 'Mumbai, India (Hybrid)',
        type: 'Full-Time',
        salary: '₹6L - ₹10L per annum',
        desc: 'Seeking a performance marketer to manage client customer acquisition channels. You will set up targeted ad funnels on Meta and Google, test ad copies, and audit CTR reporting metrics.',
        requirements: [
          '2+ years structuring positive ROI digital advertising campaigns.',
          'Expertise in lead generation lists, landing page opt-ins, and bid optimization.',
          'Strong analytical skills to interpret cost-per-lead margins.'
        ]
      });
      console.log('Default Job Opportunities Seeded Successfully.');
    }
  } catch (error) {
    console.error('Error seeding default jobs:', error.message);
  }
};

