const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users
// @route   GET /api/auth
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Update user role to admin or user
// @route   PUT /api/auth/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (req.user._id.toString() === user._id.toString()) {
        res.status(400).json({ message: 'You cannot change your own admin role status' });
        return;
      }
      user.isAdmin = req.body.isAdmin !== undefined ? !!req.body.isAdmin : user.isAdmin;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

// @desc    Send OTP to phone or email
// @route   POST /api/auth/otp/send
// @access  Public
const sendOTP = async (req, res) => {
  const { phoneOrEmail } = req.body;

  if (!phoneOrEmail) {
    return res.status(400).json({ message: 'Please enter a phone number or email address' });
  }

  const input = phoneOrEmail.trim();
  const isEmail = input.includes('@');

  try {
    let query = {};
    let formattedPhone = '';
    let formattedEmail = '';

    if (isEmail) {
      formattedEmail = input.toLowerCase();
      // Simple email validation
      if (!/\S+@\S+\.\S+/.test(formattedEmail)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }
      query = { email: formattedEmail };
    } else {
      formattedPhone = input;
      // Validate phone format
      const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
      if (!phoneRegex.test(formattedPhone)) {
        return res.status(400).json({ message: 'Please enter a valid phone number (at least 10 digits)' });
      }
      query = { phone: formattedPhone };
    }

    let user = await User.findOne(query);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let otpSent = false;

    if (isEmail) {
      // Send Email OTP using nodemailer if configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const mailOptions = {
            from: `"UNICORN Store" <${process.env.SMTP_USER}>`,
            to: formattedEmail,
            subject: 'Your UNICORN Verification Code',
            text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #d4a359; text-align: center;">UNICORN STORE</h2>
                <p>Hello,</p>
                <p>Your one-time verification code is:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f9f9f9; color: #111; border-radius: 5px;">
                  ${otp}
                </div>
                <p>This code will expire in 5 minutes.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                <p style="font-size: 11px; color: #999; text-align: center;">This is an automated verification email. Please do not reply.</p>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          otpSent = true;
          console.log(`[Email OTP] Sent verification code successfully to ${formattedEmail}`);
        } catch (err) {
          console.error('Nodemailer sending failed, falling back to console log:', err);
        }
      }
    } else {
      // Send Twilio SMS OTP if configured
      if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
          const twilio = require('twilio');
          const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
          await client.messages.create({
            body: `Your UNICORN verification code is: ${otp}. It will expire in 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone,
          });
          otpSent = true;
          console.log(`[Twilio SMS] Sent OTP code successfully to ${formattedPhone}`);
        } catch (err) {
          console.error('Twilio SMS delivery failed, falling back to console log:', err);
        }
      }
    }

    if (!user) {
      // Create skeleton user
      const defaultName = isEmail ? formattedEmail.split('@')[0] : `User-${formattedPhone.slice(-4)}`;
      user = await User.create({
        phone: isEmail ? undefined : formattedPhone,
        email: isEmail ? formattedEmail : undefined,
        name: defaultName,
        otp,
        otpExpires,
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    console.log(`[OTP Services] Generated OTP ${otp} for ${input}`);

    res.status(200).json({
      message: otpSent 
        ? `Verification code sent successfully via ${isEmail ? 'email' : 'SMS'}` 
        : 'Verification code generated (simulated)',
      otp: otpSent ? undefined : otp, // Only expose OTP if fallback simulation is active
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error sending verification code' });
  }
};

// @desc    Verify OTP and log in
// @route   POST /api/auth/otp/verify
// @access  Public
const verifyOTP = async (req, res) => {
  const { phoneOrEmail, otp } = req.body;

  if (!phoneOrEmail || !otp) {
    return res.status(400).json({ message: 'Please provide phone/email and OTP' });
  }

  const input = phoneOrEmail.trim();
  const isEmail = input.includes('@');

  try {
    const query = isEmail ? { email: input.toLowerCase() } : { phone: input };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Check if user profile is completed (needs name & email set)
    // Google users or pre-existing standard users might have name and email set.
    // Skeleton users created with sendOTP will have default name 'User-XXXX' and undefined email/phone.
    const isNewUser = !user.email || !user.phone || !user.name || user.name.startsWith('User-');

    // Generate JWT cookie
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isNewUser,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserRole,
  sendOTP,
  verifyOTP,
};
