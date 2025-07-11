const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

// Get all reviews for a specific product
router.get('/product/:productId', getProductReviews);

// Create a review (authenticated users)
router.post('/', authenticate, createReview);

// Update a review (only by owner)
router.put('/:reviewId', authenticate, updateReview);

// Delete a review (only by owner)
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router;
