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
router.get('/google', (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID === 'mock-google-client-id' || !process.env.GOOGLE_CLIENT_ID) {
    // Return a sleek mock sign-in UI
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mock Google Sign-In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-image: radial-gradient(circle at center, #1a1510 0%, #050505 100%);
          }
          .card {
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid #d4a359;
            padding: 2.5rem;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            text-align: center;
            backdrop-filter: blur(10px);
          }
          h2 {
            font-family: 'Cinzel', serif;
            margin-top: 0;
            color: #d4a359;
            letter-spacing: 2px;
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
          }
          p {
            color: #a0a0a0;
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          .user-option {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(212, 179, 89, 0.15);
            padding: 1rem;
            margin: 0.8rem 0;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .user-option:hover {
            background: rgba(212, 179, 89, 0.05);
            border-color: #d4a359;
            transform: translateY(-2px);
          }
          .user-name {
            font-weight: 600;
            color: #fff;
            font-size: 0.95rem;
          }
          .user-email {
            font-size: 0.8rem;
            color: #d4a359;
            opacity: 0.8;
          }
          .divider {
            margin: 2rem 0;
            border-top: 1px solid rgba(212, 179, 89, 0.15);
            position: relative;
          }
          .divider::after {
            content: 'OR';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0a0a0a;
            padding: 0 0.8rem;
            font-size: 0.75rem;
            color: #d4a359;
            letter-spacing: 1px;
          }
          .custom-form {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
          }
          input {
            width: 100%;
            padding: 0.8rem 1rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 0.9rem;
            transition: border-color 0.3s;
          }
          input:focus {
            outline: none;
            border-color: #d4a359;
          }
          button {
            width: 100%;
            padding: 0.9rem;
            background: #d4a359;
            border: none;
            color: #000;
            font-weight: 700;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            letter-spacing: 1px;
            transition: all 0.3s;
            text-transform: uppercase;
          }
          button:hover {
            background: #c29248;
            box-shadow: 0 0 10px rgba(212, 163, 89, 0.4);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>GOOGLE SIGN-IN</h2>
          <p>Choose an identity profile to access Unicorn Store</p>
          
          <div class="user-option" onclick="selectUser('Abhishek (Admin)', 'abhishek@unicorn.com', 'google-mock-admin-99')">
            <span class="user-name">Abhishek (Admin)</span>
            <span class="user-email">abhishek@unicorn.com</span>
          </div>
          
          <div class="user-option" onclick="selectUser('Goth Tester', 'goth.tester@gmail.com', 'google-mock-goth-88')">
            <span class="user-name">Goth Tester</span>
            <span class="user-email">goth.tester@gmail.com</span>
          </div>

          <div class="user-option" onclick="selectUser('New Explorer', 'new.oauth@gmail.com', 'google-mock-new-77')">
            <span class="user-name">New Explorer</span>
            <span class="user-email">new.oauth@gmail.com</span>
          </div>

          <div class="divider"></div>

          <div class="custom-form">
            <input type="text" id="custName" placeholder="Enter Full Name" />
            <input type="email" id="custEmail" placeholder="Enter Email Address" />
            <button onclick="submitCustom()">Simulate Login</button>
          </div>
        </div>

        <script>
          function selectUser(name, email, id) {
            window.location.href = '/api/auth/google/callback?mock=true&name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&id=' + id;
          }
          function submitCustom() {
            const name = document.getElementById('custName').value.trim();
            const email = document.getElementById('custEmail').value.trim();
            if (!name || !email) {
              alert('Name and Email are required.');
              return;
            }
            const id = 'google-mock-' + Date.now();
            selectUser(name, email, id);
          }
        </script>
      </body>
      </html>
    `);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get(
  '/google/callback',
  async (req, res, next) => {
    if (req.query.mock === 'true') {
      const { name, email, id } = req.query;
      try {
        const User = require('../models/User');
        let user = await User.findOne({ googleId: id });
        
        if (!user) {
          // If email already exists, link googleId
          let existingEmailUser = await User.findOne({ email: email.toLowerCase() });
          if (existingEmailUser) {
            existingEmailUser.googleId = id;
            await existingEmailUser.save();
            user = existingEmailUser;
          } else {
            user = await User.create({
              googleId: id,
              name: name,
              email: email.toLowerCase(),
              // Default phone to undefined so they are routed to /complete-profile
            });
          }
        }
        
        generateToken(res, user._id);
        return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
      } catch (err) {
        console.error('Mock Google Callback Error:', err);
        return res.redirect((process.env.FRONTEND_URL || 'http://localhost:5173') + '/login?error=mock_oauth_failed');
      }
    }
    
    passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, (err) => {
      if (err) {
        console.error('Google Passport Callback Error:', err);
        return res.redirect((process.env.FRONTEND_URL || 'http://localhost:5173') + '/login?error=oauth_failed');
      }
      generateToken(res, req.user._id);
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    });
  }
);

module.exports = router;
