const { Order, Invoice } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const userId = req.user.id;

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
    });

    // Generate invoice
    const invoice = await Invoice.create({
      orderId: order.id,
      invoiceNumber: `INV-${uuidv4().split('-')[0].toUpperCase()}`,
      totalAmount: order.totalAmount,
      issuedAt: new Date(),
    });

    res.status(201).json({
      message: 'Order placed and invoice generated',
      order,
      invoice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
};
