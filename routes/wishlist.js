const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

// Add to wishlist
router.post('/', authenticate, addToWishlist);

// Get user's wishlist
router.get('/', authenticate, getWishlist);

// Remove from wishlist
router.delete('/:productId', authenticate, removeFromWishlist);

module.exports = router;
