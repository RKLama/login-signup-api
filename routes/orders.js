const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

// Authenticated users
router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);

// Optional: Admin only
// You can protect this with admin middleware if needed
router.get('/', authenticate, getAllOrders);

module.exports = router;
