const express = require('express');
const router = express.Router();
const { searchProducts } = require('../controllers/productController');

router.get('/', searchProducts); // supports search, filter, sort

module.exports = router;
