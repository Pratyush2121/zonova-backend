import FAQModel from '../models/faqModel.js';
const FAQ = (FAQModel && FAQModel.default) ? (FAQModel.default.default || FAQModel.default) : FAQModel;

export const getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    let faqs = await FAQ.find(filter);

    const limit = parseInt(req.query.limit) || 0;
    if (limit > 0) {
      faqs = faqs.slice(0, limit);
    }

    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = await FAQ.create({ question, answer, category: category || 'General' });
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    const { question, answer, category } = req.body;
    const updated = await FAQ.findByIdAndUpdate(req.params.id, {
      question: question || faq.question,
      answer: answer || faq.answer,
      category: category || faq.category
    }, { new: true });

    res.json({ success: true, faq: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
