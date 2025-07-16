const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryWithProducts,
} = require('../controllers/categoryController');

const { authenticate } = require('../middleware/authMiddleware');

// Routes
router.get('/', getAllCategories);
router.post('/', authenticate, createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);
router.get('/:id/products', getCategoryWithProducts);

module.exports = router;
