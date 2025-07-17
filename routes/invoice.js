const express = require('express');
const router = express.Router();
const { getInvoiceByOrder } = require('../controllers/invoiceController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/:orderId', authenticate, getInvoiceByOrder);

module.exports = router;
