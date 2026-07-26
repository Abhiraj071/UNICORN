require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const publicImagesDir = path.join(__dirname, '../../frontend/public/images');
const distImagesDir = path.join(__dirname, '../../frontend/dist/images');
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure target directories exist
[publicImagesDir, distImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
});

const migrate = async () => {
  // Step 1: Always sync all files from backend/uploads/ into frontend/public/images and frontend/dist/images
  if (fs.existsSync(uploadsDir)) {
    const uploadedFiles = fs.readdirSync(uploadsDir);
    console.log(`Found ${uploadedFiles.length} files in backend/uploads to copy...`);

    uploadedFiles.forEach((file) => {
      const srcPath = path.join(uploadsDir, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, path.join(publicImagesDir, file));
        if (fs.existsSync(distImagesDir)) {
          fs.copyFileSync(srcPath, path.join(distImagesDir, file));
        }
      }
    });
    console.log('Successfully copied all uploaded files to store image folders (public/images & dist/images)!');
  }

  // Step 2: Update Product image fields in database
  const mongoUris = [
    process.env.MONGO_URI,
    'mongodb://127.0.0.1:27017/unicorn',
    'mongodb://localhost:27017/unicorn'
  ].filter(Boolean);

  let connected = false;
  for (const uri of mongoUris) {
    try {
      console.log(`Attempting connection to MongoDB: ${uri.replace(/\/\/.*@/, '//***@')}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log('Connected to MongoDB!');
      connected = true;
      break;
    } catch (err) {
      console.warn(`Could not connect to ${uri.replace(/\/\/.*@/, '//***@')}: ${err.message}`);
    }
  }

  if (!connected) {
    console.log('Could not connect to database. File sync was completed successfully.');
    process.exit(0);
  }

  try {
    const products = await Product.find({});
    console.log(`Scanning ${products.length} products in database...`);

    let updatedCount = 0;

    for (const prod of products) {
      let isModified = false;

      const cleanPath = (url) => {
        if (!url || typeof url !== 'string') return url;
        if (url.includes('/uploads/')) {
          const filename = url.substring(url.indexOf('/uploads/') + '/uploads/'.length);
          return `/images/${filename}`;
        }
        if (url.startsWith('uploads/')) {
          const filename = url.replace(/^uploads\//, '');
          return `/images/${filename}`;
        }
        return url;
      };

      const newImage = cleanPath(prod.image);
      if (newImage !== prod.image) {
        prod.image = newImage;
        isModified = true;
      }

      if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
        const newGallery = prod.gallery.map((g) => cleanPath(g));
        if (JSON.stringify(newGallery) !== JSON.stringify(prod.gallery)) {
          prod.gallery = newGallery;
          isModified = true;
        }
      }

      if (isModified) {
        await prod.save();
        updatedCount++;
        console.log(`Updated product "${prod.name}" -> Image: ${prod.image}`);
      }
    }

    console.log(`Migration Complete! ${updatedCount} products updated in database.`);
    process.exit(0);
  } catch (error) {
    console.error('Database migration error:', error);
    process.exit(1);
  }
};

migrate();
