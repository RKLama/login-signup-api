const path = require('path');
const fs = require('fs');
const { Invoice, Order, User } = require('../models');
const generateInvoicePDF = require('../utils/invoiceGenerator');

const getInvoiceByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const invoice = await Invoice.findOne({
      where: { orderId },
      include: {
        model: Order,
        as: 'order'
      }
    });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.status(200).json({ invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const downloadInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: {
        model: Order,
        as: 'order',
        include: {
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, '..', 'temp', fileName);

    // Generate PDF
    generateInvoicePDF(invoice, invoice.order, invoice.order.user, filePath);

    // Wait a moment to ensure PDF is written before sending
    setTimeout(() => {
      res.download(filePath, fileName, (err) => {
        if (err) console.error('Download error:', err);
        fs.unlinkSync(filePath); // Delete temp file
      });
    }, 500);

  } catch (error) {
    console.error('Invoice download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getInvoiceByOrder, downloadInvoice };
