const express = require('express');
const router = express.Router();
<<<<<<< HEAD
<<<<<<< HEAD
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
=======
const { searchProducts } = require('../controllers/productController');

router.get('/', searchProducts); // supports search, filter, sort
>>>>>>> feat/admin-dashboard
=======
const { getAllProducts, searchProducts } = require('../controllers/productController');
const { getRelatedProducts, getPopularProducts } = require('../controllers/productController');

// Search route (must be above :id route if present)
router.get('/search', searchProducts);

// All products route
router.get('/', getAllProducts);
<<<<<<< HEAD
>>>>>>> feat/product-search
=======
router.get('/search/autocomplete', searchAutocomplete);
<<<<<<< HEAD
>>>>>>> feat/search-autocomplete
=======
router.get('/:productId/related', getRelatedProducts);
router.get('/popular/all', getPopularProducts);
>>>>>>> feat/product-recommendations

module.exports = router;
