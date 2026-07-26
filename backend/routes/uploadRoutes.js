const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');

const publicImagesDir = path.join(__dirname, '../../frontend/public/images');
const distImagesDir = path.join(__dirname, '../../frontend/dist/images');
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure target directories exist
[publicImagesDir, distImagesDir, uploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      // Ignore directory creation errors if dist doesn't exist yet
    }
  }
});

// Configure multer storage to save uploads into frontend store images folder (public/images)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    cb(null, publicImagesDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype && file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, webp, svg)'));
  }
}

const upload = multer({
  storage,
  fileFilter,
});

const uploadSingleImage = upload.single('image');

router.post('/', protect, admin, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    // Sync file to dist/images if dist directory exists
    if (fs.existsSync(distImagesDir)) {
      try {
        fs.copyFileSync(req.file.path, path.join(distImagesDir, req.file.filename));
      } catch (copyErr) {
        console.warn('Failed copying uploaded file to dist/images:', copyErr);
      }
    }

    // Sync file to backend/uploads as backup
    if (fs.existsSync(uploadsDir)) {
      try {
        fs.copyFileSync(req.file.path, path.join(uploadsDir, req.file.filename));
      } catch (copyErr) {
        console.warn('Failed copying uploaded file to backend/uploads:', copyErr);
      }
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      image: `/images/${req.file.filename}`,
    });
  });
});

module.exports = router;
