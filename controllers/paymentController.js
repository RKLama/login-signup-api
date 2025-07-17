const { Payment, Order, User } = require('../models');

const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, provider } = req.body;
    const userId = req.user.id;

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    const payment = await Payment.create({
      userId,
      orderId,
      amount,
      provider,
      status: 'completed',
      paymentDate: new Date()
    });

    // You can also update order status here if needed
    await order.update({ status: 'paid' });

    res.status(201).json({
      message: 'Payment successful',
      payment
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error during payment' });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.findAll({
      where: { userId },
      include: ['order']
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error fetching payments' });
  }
};

module.exports = {
  initiatePayment,
  getUserPayments
};
