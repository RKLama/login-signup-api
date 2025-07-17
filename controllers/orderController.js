<<<<<<< HEAD
const { Order, OrderItem, Product } = require('../models');

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;

  try {
    // Calculate total and validate stock
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({ userId, total });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id });
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getMyOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items', include: ['product'] }],
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items', include: ['product'] }, 'user'],
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders };
=======
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
>>>>>>> feat/invoice
