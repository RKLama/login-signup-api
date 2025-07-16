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
