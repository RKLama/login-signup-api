const express = require('express');
const router = express.Router();
const { getInvoiceByOrder } = require('../controllers/invoiceController');
const { authenticate } = require('../middleware/authMiddleware');
const { downloadInvoice } = require('../controllers/invoiceController');

router.get('/:orderId', authenticate, getInvoiceByOrder);
router.get('/:invoiceId/download', authenticate, downloadInvoice);

module.exports = router;
