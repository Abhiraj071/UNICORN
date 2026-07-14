const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      comparePrice,
      category,
      collectionName,
      brand,
      badge,
      countInStock,
      featured,
      limited,
      fabric,
      gsm,
      fit,
      color,
      gender,
      sizes,
      image,
      gallery,
      description,
      features
    } = req.body;

    // Generate unique id and slug
    const generatedId = 'UNI-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const generatedSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 5)}`;

    const sku = `SKU-${category.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const product = new Product({
      id: generatedId,
      name,
      slug: generatedSlug,
      category,
      collectionName,
      brand: brand || 'UNICORN',
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      badge,
      sku,
      countInStock: Number(countInStock) || 0,
      featured: !!featured,
      limited: !!limited,
      fabric,
      gsm: gsm ? Number(gsm) : undefined,
      fit,
      color,
      gender,
      sizes: Array.isArray(sizes) ? sizes : [],
      image,
      gallery: Array.isArray(gallery) ? gallery : [],
      description,
      features: Array.isArray(features) ? features : []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      comparePrice,
      category,
      collectionName,
      brand,
      badge,
      countInStock,
      featured,
      limited,
      fabric,
      gsm,
      fit,
      color,
      gender,
      sizes,
      image,
      gallery,
      description,
      features
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      if (name) {
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        product.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 5)}`;
      }
      product.price = price !== undefined ? Number(price) : product.price;
      product.comparePrice = comparePrice !== undefined ? Number(comparePrice) : product.comparePrice;
      product.category = category || product.category;
      product.collectionName = collectionName || product.collectionName;
      product.brand = brand || product.brand;
      product.badge = badge !== undefined ? badge : product.badge;
      product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
      product.featured = featured !== undefined ? !!featured : product.featured;
      product.limited = limited !== undefined ? !!limited : product.limited;
      product.fabric = fabric !== undefined ? fabric : product.fabric;
      product.gsm = gsm !== undefined ? Number(gsm) : product.gsm;
      product.fit = fit !== undefined ? fit : product.fit;
      product.color = color !== undefined ? color : product.color;
      product.gender = gender !== undefined ? gender : product.gender;
      product.sizes = Array.isArray(sizes) ? sizes : product.sizes;
      product.image = image || product.image;
      product.gallery = Array.isArray(gallery) ? gallery : product.gallery;
      product.description = description || product.description;
      product.features = Array.isArray(features) ? features : product.features;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message || 'Invalid update details' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
