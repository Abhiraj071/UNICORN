require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const distImagesDir = path.join(__dirname, '../../frontend/dist/images');
const publicImagesDir = path.join(__dirname, '../../frontend/public/images');

// Ensure all custom images are synced between dist/images and public/images
const targetImages = [
  { file: 'fallen-stran.jpeg', name: 'Fallen Strain Oversized Tee', slug: 'fallen-strain-oversized-tee', category: 'Oversized T-Shirt', collection: 'Core Collection', price: 1499, sku: 'UNI-FS-001' },
  { file: 'fallen-acsen.jpg', name: 'Fallen Accent Heavyweight Tee', slug: 'fallen-accent-heavyweight-tee', category: 'Oversized T-Shirt', collection: 'Core Collection', price: 1599, sku: 'UNI-FA-002' },
  { file: 'lycra01.PNG', name: 'Lycra Fit Performance Tee v1', slug: 'lycra-fit-performance-tee-v1', category: 'Activewear', collection: 'Street Utility', price: 1299, sku: 'UNI-LYC-001' },
  { file: 'lycra02.PNG', name: 'Lycra Fit Performance Tee v2', slug: 'lycra-fit-performance-tee-v2', category: 'Activewear', collection: 'Street Utility', price: 1399, sku: 'UNI-LYC-002' },
  { file: 'lycra001.jpg', name: 'Lycra Performance Edition Hoodie', slug: 'lycra-performance-edition-hoodie', category: 'Hoodie', collection: 'Limited Drops', price: 2899, sku: 'UNI-LYC-003' },
  { file: 'gym lightining (1).png', name: 'Gym Lightning Performance Tee (Edition 1)', slug: 'gym-lightning-performance-tee-1', category: 'Activewear', collection: 'Street Utility', price: 1699, sku: 'UNI-GYM-001' },
  { file: 'gym lightining (2).png', name: 'Gym Lightning Performance Tee (Edition 2)', slug: 'gym-lightning-performance-tee-2', category: 'Activewear', collection: 'Street Utility', price: 1699, sku: 'UNI-GYM-002' },
  { file: 'gym lightining (3).png', name: 'Gym Lightning Performance Tee (Edition 3)', slug: 'gym-lightning-performance-tee-3', category: 'Activewear', collection: 'Street Utility', price: 1699, sku: 'UNI-GYM-003' },
];

targetImages.forEach(img => {
  const distPath = path.join(distImagesDir, img.file);
  const publicPath = path.join(publicImagesDir, img.file);
  
  if (fs.existsSync(distPath) && !fs.existsSync(publicPath)) {
    fs.copyFileSync(distPath, publicPath);
    console.log(`Synced ${img.file} from dist/images to public/images`);
  } else if (fs.existsSync(publicPath) && !fs.existsSync(distPath)) {
    if (!fs.existsSync(distImagesDir)) fs.mkdirSync(distImagesDir, { recursive: true });
    fs.copyFileSync(publicPath, distPath);
    console.log(`Synced ${img.file} from public/images to dist/images`);
  }
});

const run = async () => {
  const uris = [
    process.env.MONGO_URI,
    'mongodb://127.0.0.1:27017/unicorn',
    'mongodb://localhost:27017/unicorn'
  ].filter(Boolean);

  for (const uri of uris) {
    try {
      console.log(`Attempting connection to MongoDB: ${uri.replace(/\/\/.*@/, '//***@')}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`Successfully connected to MongoDB (${uri.includes('mongodb+srv') ? 'Render Atlas Cloud DB' : 'Local DB'})!`);

      // Upsert products for each image
      for (const item of targetImages) {
        const imagePath = `/images/${item.file}`;
        
        const updateData = {
          id: item.slug,
          name: item.name,
          slug: item.slug,
          category: item.category,
          collectionName: item.collection,
          brand: 'UNICORN',
          price: item.price,
          comparePrice: item.price + 300,
          currency: 'INR',
          badge: 'NEW',
          sku: item.sku,
          countInStock: 25,
          featured: true,
          limited: false,
          rating: 4.9,
          reviews: 12,
          fabric: 'Premium Blend / Lycra Cotton',
          gsm: 240,
          fit: 'Oversized / Athletic',
          color: 'Black',
          gender: 'Unisex',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          image: imagePath,
          gallery: [imagePath],
          description: `High performance ${item.name} designed with premium store aesthetic and comfort.`,
          features: ['Breathable Fabric', 'Oversized Fit', 'Pre-shrunk', 'Store Exclusive']
        };

        const result = await Product.findOneAndUpdate(
          { slug: item.slug },
          { $set: updateData },
          { upsert: true, returnDocument: 'after' }
        );
        console.log(`Updated/Created Product in DB: "${result.name}" with Image path: ${result.image}`);
      }

      console.log('All custom images successfully assigned to products in database!');
      await mongoose.disconnect();
    } catch (err) {
      console.warn(`Connection to ${uri.replace(/\/\/.*@/, '//***@')} failed: ${err.message}`);
    }
  }

  process.exit(0);
};

run();
