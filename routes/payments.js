const express = require('express');
const router = express.Router();
const { initiatePayment, getUserPayments } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, initiatePayment);
router.get('/', authenticate, getUserPayments);

module.exports = router;
