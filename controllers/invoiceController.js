const { Invoice, Order } = require('../models');

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

module.exports = { getInvoiceByOrder };
