const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  getAllReviews,
  approveReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview)
  .get(protect, admin, getAllReviews);

router.get('/product/:productId', getProductReviews);

router.route('/:id')
  .delete(protect, admin, deleteReview);

router.put('/:id/approve', protect, admin, approveReview);

module.exports = router;
