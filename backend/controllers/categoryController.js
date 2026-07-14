const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();

    // Check if category already exists
    const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name: trimmedName });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category name (cascade changes to products)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if another category has the same name
    const categoryExists = await Category.findOne({ 
      _id: { $ne: category._id },
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
    });
    if (categoryExists) {
      return res.status(400).json({ message: 'Another category with this name already exists' });
    }

    const oldName = category.name;
    category.name = trimmedName;
    const updatedCategory = await category.save();

    // Cascade update to associated products
    if (oldName !== trimmedName) {
      await Product.updateMany({ category: oldName }, { category: trimmedName });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category (prevents deletion if products exist)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if any product exists under this category name
    const productsCount = await Product.countDocuments({ category: category.name });
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category "${category.name}" because it has ${productsCount} active products associated with it.` 
      });
    }

    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
