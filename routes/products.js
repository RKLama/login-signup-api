const express = require('express');
const router = express.Router();
const { getAllProducts, searchProducts } = require('../controllers/productController');

// Search route (must be above :id route if present)
router.get('/search', searchProducts);

// All products route
router.get('/', getAllProducts);

module.exports = router;
