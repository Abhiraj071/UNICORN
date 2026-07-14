const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
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

    res.status(200).json({
      message: 'Image uploaded successfully',
      image: `/api/uploads/${req.file.filename}`,
    });
  });
});

module.exports = router;
