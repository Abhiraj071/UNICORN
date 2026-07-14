const Faq = require('../models/Faq');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({}).sort({ category: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFaq = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faq = await Faq.create({ question, answer, category });
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (faq) {
      faq.question = req.body.question || faq.question;
      faq.answer = req.body.answer || faq.answer;
      faq.category = req.body.category || faq.category;

      const updatedFaq = await faq.save();
      res.json(updatedFaq);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (faq) {
      await faq.deleteOne();
      res.json({ message: 'FAQ deleted successfully' });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq
};
