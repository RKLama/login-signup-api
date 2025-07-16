const { User, Order, Product } = require('../models');
const { Op } = require('sequelize');

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount');

    const popularProducts = await Product.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Order,
        as: 'orders',
        attributes: [],
      }],
      group: ['Product.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('orders.id')), 'DESC']],
      limit: 5,
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      popularProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAnalytics };
