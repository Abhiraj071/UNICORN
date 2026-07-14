const express = require('express');
const router = express.Router();
const {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq
} = require('../controllers/faqController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFaqs)
  .post(protect, admin, createFaq);

router.route('/:id')
  .put(protect, admin, updateFaq)
  .delete(protect, admin, deleteFaq);

module.exports = router;
