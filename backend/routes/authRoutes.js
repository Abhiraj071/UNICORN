const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateToken = require('../utils/generateToken');
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserRole,
  sendOTP,
  verifyOTP,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin user management routes
router.route('/')
  .get(protect, admin, getUsers);
router.route('/:id/role')
  .put(protect, admin, updateUserRole);

// OTP routes
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, generate token and redirect.
    generateToken(res, req.user._id);
    res.redirect(process.env.FRONTEND_URL);
  }
);

module.exports = router;
