require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

connectDB();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

const passport = require('passport');
require('./config/passport');

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://unicornonyx.com',
  'https://www.unicornonyx.com',
  'https://unicornonlyx.com',
  'https://www.unicornonlyx.com',
  'http://localhost:5173',
  'http://localhost:5000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.includes('herositepro.com') ||
      origin.includes('milesweb') ||
      origin.includes('unicornonyx.com') ||
      origin.includes('unicornonlyx.com')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Serve static upload & image files
app.use('/api/uploads', express.static(uploadsDir));
const publicImagesDir = path.join(__dirname, '../frontend/public/images');
const distImagesDir = path.join(__dirname, '../frontend/dist/images');
if (fs.existsSync(publicImagesDir)) {
  app.use('/images', express.static(publicImagesDir));
}
if (fs.existsSync(distImagesDir)) {
  app.use('/images', express.static(distImagesDir));
}

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Unicorn Store API is running cleanly on Render' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const faqRoutes = require('./routes/faqRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/tickets', ticketRoutes);
// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  
  app.get('/*splat', (req, res) => {
    // Prevent catching API routes that might be spelling mistakes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API Route Not Found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

