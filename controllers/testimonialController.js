import Testimonial from '../models/testimonialModel.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { author, role, company, text, rating } = req.body;

    if (!author || !role || !company || !text) {
      return res.status(400).json({ success: false, message: 'Author, role, company and review text are required' });
    }

    let image = '/uploads/team-placeholder.png';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const testimonial = await Testimonial.create({
      author,
      role,
      company,
      text,
      image,
      rating: Number(rating) || 5
    });

    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const { author, role, company, text, rating } = req.body;

    let image = testimonial.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, {
      author: author || testimonial.author,
      role: role || testimonial.role,
      company: company || testimonial.company,
      text: text || testimonial.text,
      image,
      rating: rating !== undefined ? Number(rating) : testimonial.rating
    }, { new: true });

    res.json({ success: true, testimonial: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
