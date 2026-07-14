const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  collectionName: { type: String, required: true }, // mapped from 'collection'
  brand: { type: String, default: 'UNICORN' },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  currency: { type: String, default: 'INR' },
  badge: { type: String },
  sku: { type: String },
  countInStock: { type: Number, required: true, default: 0 }, // mapped from 'stock'
  featured: { type: Boolean, default: false },
  limited: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  fabric: { type: String },
  gsm: { type: Number },
  fit: { type: String },
  color: { type: String },
  gender: { type: String },
  sizes: [{ type: String }],
  image: { type: String, required: true }, // mapped from 'thumbnail'
  gallery: [{ type: String }],
  description: { type: String, required: true },
  features: [{ type: String }],
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
