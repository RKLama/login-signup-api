const { Op } = require('sequelize');
const Product = require('../models/Product);

const getAllProducts = async (req, res) => {
try {
    if (!req.product || !req.product.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const products = await Product.findAll({
      attributes: ['id', 'title', 'description', 'price']
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { search, categoryId, minPrice, maxPrice, sortBy, order } = req.query;

    const where = {};
    const orderBy = [];

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (sortBy) {
      orderBy.push([sortBy, order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
    }

    const products = await Product.findAll({
      where,
      order: orderBy,
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });

    res.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, searchProducts };