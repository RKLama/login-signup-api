const { Order, Invoice } = require('../models');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

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

    // Send confirmation email
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmation',
      text: `Your order (ID: ${order.id}) has been placed.`,
      html: `<h2>Thank you for your order!</h2>
             <p>Your order ID is <strong>${order.id}</strong>.</p>
             <p>Total Amount: <strong>$${order.totalAmount.toFixed(2)}</strong></p>`
    });

    res.status(201).json({
      message: 'Order placed, invoice generated, and confirmation email sent.',
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
