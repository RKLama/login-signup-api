const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

router.use(authenticate);

router.post('/', addToCart);
router.get('/', getCart);
router.delete('/:productId', removeFromCart);

module.exports = router;
