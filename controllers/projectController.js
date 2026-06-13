import ProjectModel from '../models/projectModel.js';
const Project = (ProjectModel && ProjectModel.default) ? (ProjectModel.default.default || ProjectModel.default) : ProjectModel;

export const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    let projects = await Project.find(filter);
    
    const limit = parseInt(req.query.limit) || 0;
    if (limit > 0) {
      projects = projects.slice(0, limit);
    }

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      clientGoals,
      challenges,
      solution,
      results,
      testimonialText,
      testimonialAuthor,
      testimonialRole,
      technologyStack,
      featured,
      link
    } = req.body;

    let screenshots = [];
    if (req.files && req.files.length > 0) {
      screenshots = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.screenshots) {
      screenshots = Array.isArray(req.body.screenshots) 
        ? req.body.screenshots 
        : JSON.parse(req.body.screenshots);
    }

    const techStack = Array.isArray(technologyStack) 
      ? technologyStack 
      : (technologyStack ? technologyStack.split(',').map(item => item.trim()) : []);

    const project = await Project.create({
      title,
      description,
      category,
      clientGoals,
      challenges,
      solution,
      screenshots,
      results,
      testimonialText,
      testimonialAuthor,
      testimonialRole,
      technologyStack: techStack,
      featured: featured === 'true' || featured === true,
      link
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const {
      title,
      description,
      category,
      clientGoals,
      challenges,
      solution,
      results,
      testimonialText,
      testimonialAuthor,
      testimonialRole,
      technologyStack,
      featured,
      link
    } = req.body;

    let screenshots = project.screenshots || [];
    if (req.files && req.files.length > 0) {
      const newScreenshots = req.files.map(file => `/uploads/${file.filename}`);
      screenshots = [...screenshots, ...newScreenshots];
    } else if (req.body.screenshots) {
      screenshots = Array.isArray(req.body.screenshots) 
        ? req.body.screenshots 
        : JSON.parse(req.body.screenshots);
    }

    const techStack = Array.isArray(technologyStack) 
      ? technologyStack 
      : (technologyStack ? technologyStack.split(',').map(item => item.trim()) : project.technologyStack);

    const updated = await Project.findByIdAndUpdate(req.params.id, {
      title: title || project.title,
      description: description || project.description,
      category: category || project.category,
      clientGoals: clientGoals || project.clientGoals,
      challenges: challenges || project.challenges,
      solution: solution || project.solution,
      results: results || project.results,
      testimonialText: testimonialText || project.testimonialText,
      testimonialAuthor: testimonialAuthor || project.testimonialAuthor,
      testimonialRole: testimonialRole || project.testimonialRole,
      technologyStack: techStack,
      screenshots,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : project.featured,
      link: link !== undefined ? link : project.link
    }, { new: true });

    res.json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
