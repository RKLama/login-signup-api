const { Order, Invoice } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const { totalAmount, paymentMethod } = req.body;
    const userId = req.user.id;

    // Generate payment reference
    const paymentReference = `PAY-${uuidv4().split('-')[0].toUpperCase()}`;
    const paymentStatus = 'paid'; // or 'pending' if simulating gateways

    // Create order with payment info
    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
      paymentMethod,
      paymentStatus,
      paymentReference,
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

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    // Validate status
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ message: 'Payment status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  updatePaymentStatus,
};
