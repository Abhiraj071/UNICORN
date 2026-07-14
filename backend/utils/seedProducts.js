const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unicorn';

const mockProductsRaw = [
  {
    "id": "tee-dark-emblem-001",
    "name": "Dark Emblem Tee",
    "slug": "dark-emblem-tee",
    "category": "Oversized T-Shirt",
    "collection": "Core Collection",
    "brand": "UNICORN",
    "price": 1299,
    "comparePrice": 1599,
    "currency": "INR",
    "badge": "NEW",
    "sku": "UNI-TEE-001",
    "stock": 48,
    "featured": true,
    "limited": false,
    "rating": 4.9,
    "reviews": 82,
    "fabric": "100% Premium Cotton",
    "gsm": 240,
    "fit": "Oversized",
    "color": "Black",
    "gender": "Unisex",
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "thumbnail": "/images/1.png",
    "gallery": [
      "/images/1.png"
    ],
    "description": "Minimal gothic oversized tee featuring Unicorn cross chest artwork with premium heavyweight cotton.",
    "features": [
      "240 GSM",
      "Oversized Fit",
      "Pre-shrunk",
      "Bio Wash",
      "Screen Printed",
      "Premium Cotton"
    ]
  },
  {
    "id": "hoodie-shadow-guardian-001",
    "name": "Shadow Guardian Hoodie",
    "slug": "shadow-guardian-hoodie",
    "category": "Hoodie",
    "collection": "Limited Drops",
    "brand": "UNICORN",
    "price": 2799,
    "comparePrice": 3299,
    "currency": "INR",
    "badge": "BEST SELLER",
    "sku": "UNI-HOD-001",
    "stock": 18,
    "featured": true,
    "limited": true,
    "rating": 5.0,
    "reviews": 146,
    "fabric": "Heavyweight Cotton",
    "gsm": 500,
    "fit": "Oversized",
    "color": "Black",
    "gender": "Unisex",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "thumbnail": "/images/2.png",
    "gallery": [
      "/images/2.png"
    ],
    "description": "Heavyweight oversized hoodie featuring angel guardian gothic artwork.",
    "features": [
      "500 GSM",
      "Premium Cotton",
      "Oversized Fit",
      "Limited Edition",
      "Puff Print",
      "Brushed Fleece"
    ]
  },
  {
    "id": "cargo-shadow-001",
    "name": "Shadow Cargo Pants",
    "slug": "shadow-cargo-pants",
    "category": "Cargo Pants",
    "collection": "Street Utility",
    "brand": "UNICORN",
    "price": 2499,
    "comparePrice": 2899,
    "currency": "INR",
    "badge": "NEW",
    "sku": "UNI-CAR-001",
    "stock": 22,
    "featured": true,
    "limited": false,
    "rating": 4.8,
    "reviews": 59,
    "fabric": "Premium Cotton Twill",
    "fit": "Relaxed",
    "color": "Black",
    "gender": "Unisex",
    "sizes": ["28", "30", "32", "34", "36"],
    "thumbnail": "/images/3.png",
    "gallery": [
      "/images/3.png"
    ],
    "description": "Military-inspired cargo pants with multiple utility pockets and gothic branding.",
    "features": [
      "Relaxed Fit",
      "Multiple Cargo Pockets",
      "Adjustable Hem",
      "Heavy Duty Fabric",
      "Metal Hardware"
    ]
  },
  {
    "id": "tee-unicorn-logo-001",
    "name": "Minimal Logo Tee",
    "slug": "minimal-logo-tee",
    "category": "Oversized T-Shirt",
    "collection": "Essentials",
    "brand": "UNICORN",
    "price": 999,
    "comparePrice": 1299,
    "currency": "INR",
    "badge": "ESSENTIAL",
    "sku": "UNI-TEE-002",
    "stock": 65,
    "featured": false,
    "limited": false,
    "rating": 4.7,
    "reviews": 91,
    "fabric": "100% Cotton",
    "gsm": 220,
    "fit": "Oversized",
    "color": "Black",
    "gender": "Unisex",
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "thumbnail": "/images/4.png",
    "gallery": [
      "/images/4.png"
    ],
    "description": "Minimal everyday oversized tee with embroidered Unicorn branding.",
    "features": [
      "220 GSM",
      "Embroidery Logo",
      "Oversized Fit",
      "Premium Cotton"
    ]
  },
  {
    "id": "visor-cyberpunk-001",
    "name": "Cyberpunk Visor",
    "slug": "cyberpunk-visor",
    "category": "Accessories",
    "collection": "Future Noir",
    "brand": "UNICORN",
    "price": 3499,
    "comparePrice": 3999,
    "currency": "INR",
    "badge": "LIMITED",
    "sku": "UNI-ACC-001",
    "stock": 9,
    "featured": true,
    "limited": true,
    "rating": 5.0,
    "reviews": 21,
    "color": "Black",
    "thumbnail": "/images/5.png",
    "gallery": [
      "/images/5.png"
    ],
    "description": "Futuristic cyberpunk visor inspired by neon dystopian aesthetics.",
    "features": [
      "Reflective Shield",
      "RGB Inspired Design",
      "Adjustable Headband",
      "Collector Edition"
    ]
  },
  {
    "id": "tee-raven-angel-001",
    "name": "Raven Angel Tee",
    "slug": "raven-angel-tee",
    "category": "Oversized T-Shirt",
    "collection": "Dark Mythology",
    "brand": "UNICORN",
    "price": 1499,
    "comparePrice": 1799,
    "currency": "INR",
    "badge": "POPULAR",
    "sku": "UNI-TEE-003",
    "stock": 26,
    "featured": true,
    "limited": false,
    "rating": 4.9,
    "reviews": 108,
    "fabric": "Heavyweight Cotton",
    "gsm": 260,
    "fit": "Oversized",
    "color": "Black",
    "gender": "Unisex",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "thumbnail": "/images/6.png",
    "gallery": [
      "/images/6.png"
    ],
    "description": "Oversized gothic tee featuring celestial angel illustration on the back.",
    "features": [
      "260 GSM",
      "Premium Screen Print",
      "Oversized Fit",
      "Vintage Wash"
    ]
  },
  {
    "id": "hoodie-nocturnal-001",
    "name": "Nocturnal Zip Hoodie",
    "slug": "nocturnal-zip-hoodie",
    "category": "Zip Hoodie",
    "collection": "Dark Collection",
    "brand": "UNICORN",
    "price": 2999,
    "comparePrice": 3499,
    "currency": "INR",
    "badge": "LIMITED",
    "sku": "UNI-HOD-002",
    "stock": 14,
    "featured": true,
    "limited": true,
    "rating": 4.9,
    "reviews": 43,
    "fabric": "Heavyweight Cotton",
    "gsm": 500,
    "fit": "Oversized",
    "color": "Black",
    "sizes": ["S", "M", "L", "XL"],
    "thumbnail": "/images/7.png",
    "gallery": [
      "/images/7.png"
    ],
    "description": "Premium zip hoodie with dark wing gothic artwork.",
    "features": [
      "500 GSM",
      "YKK Zip",
      "Oversized",
      "Premium Print"
    ]
  },
  {
    "id": "jacket-unicorn-001",
    "name": "Eclipse Denim Jacket",
    "slug": "eclipse-denim-jacket",
    "category": "Jacket",
    "collection": "Outerwear",
    "brand": "UNICORN",
    "price": 3999,
    "comparePrice": 4599,
    "currency": "INR",
    "badge": "NEW",
    "sku": "UNI-JKT-001",
    "stock": 12,
    "featured": true,
    "limited": false,
    "rating": 4.8,
    "reviews": 37,
    "fabric": "Premium Denim",
    "fit": "Relaxed",
    "color": "Washed Black",
    "sizes": ["S", "M", "L", "XL"],
    "thumbnail": "/images/8.png",
    "gallery": [
      "/images/8.png"
    ],
    "description": "Premium washed denim jacket featuring Unicorn gothic artwork.",
    "features": [
      "Premium Denim",
      "Stone Wash",
      "Large Back Print",
      "Metal Buttons"
    ]
  },
  {
    "id": "cap-unicorn-001",
    "name": "Unicorn Logo Cap",
    "slug": "unicorn-logo-cap",
    "category": "Cap",
    "collection": "Accessories",
    "brand": "UNICORN",
    "price": 799,
    "comparePrice": 999,
    "currency": "INR",
    "badge": "NEW",
    "sku": "UNI-CAP-001",
    "stock": 74,
    "featured": false,
    "limited": false,
    "rating": 4.6,
    "reviews": 54,
    "color": "Black",
    "thumbnail": "/images/9.png",
    "gallery": [
      "/images/9.png"
    ],
    "description": "Minimal embroidered Unicorn cap for everyday wear.",
    "features": [
      "Embroidery",
      "Adjustable Strap",
      "Premium Cotton",
      "One Size"
    ]
  },
  {
    "id": "tee-unicorn-vintage-001",
    "name": "Vintage Unicorn Tee",
    "slug": "vintage-unicorn-tee",
    "category": "Oversized T-Shirt",
    "collection": "Vintage Gothic",
    "brand": "UNICORN",
    "price": 1699,
    "comparePrice": 1999,
    "currency": "INR",
    "badge": "LIMITED",
    "sku": "UNI-TEE-004",
    "stock": 16,
    "featured": true,
    "limited": true,
    "rating": 5.0,
    "reviews": 64,
    "fabric": "Acid Wash Cotton",
    "gsm": 260,
    "fit": "Oversized",
    "color": "Vintage Black",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "thumbnail": "/images/10.png",
    "gallery": [
      "/images/10.png"
    ],
    "description": "Vintage washed oversized tee featuring majestic unicorn gothic artwork.",
    "features": [
      "260 GSM",
      "Acid Wash",
      "Oversized",
      "Premium Screen Print"
    ]
  }
];

const mockProducts = mockProductsRaw.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  collectionName: p.collection,
  brand: p.brand || 'UNICORN',
  price: p.price,
  comparePrice: p.comparePrice,
  currency: p.currency || 'INR',
  badge: p.badge,
  sku: p.sku,
  countInStock: p.stock || 0,
  featured: p.featured || false,
  limited: p.limited || false,
  rating: p.rating || 0,
  reviews: p.reviews || 0,
  fabric: p.fabric,
  gsm: p.gsm,
  fit: p.fit,
  color: p.color,
  gender: p.gender,
  sizes: p.sizes || [],
  image: p.thumbnail,
  gallery: p.gallery || [],
  description: p.description,
  features: p.features || []
}));

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert mock products
    const createdProducts = await Product.insertMany(mockProducts);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    // Seed categories based on unique mock product categories
    const Category = require('../models/Category');
    await Category.deleteMany({});
    console.log('Cleared existing categories.');

    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
    const categoryDocs = uniqueCategories.map(name => ({ name }));
    await Category.insertMany(categoryDocs);
    console.log(`Successfully seeded ${uniqueCategories.length} categories!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
