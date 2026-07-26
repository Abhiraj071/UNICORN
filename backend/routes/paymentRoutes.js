const express = require('express');
const router = express.Router();
const {
  createPhonePePayment,
  checkPhonePeStatus,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// PhonePe Business Routes
router.post('/phonepe/pay', protect, createPhonePePayment);
router.get('/phonepe/status/:merchantTransactionId', protect, checkPhonePeStatus);

// Razorpay Routes
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router;
