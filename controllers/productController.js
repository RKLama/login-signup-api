const { Op } = require('sequelize');
const { Product, Category } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count and paginated data
    const { count, rows: products } = await Product.findAndCountAll({
      offset,
      limit,
      attributes: ['id', 'title', 'description', 'price']
    });

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, inStock } = req.query;

    const whereClause = {};

    if (keyword) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        { description: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    if (category) {
      whereClause.categoryId = category;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      whereClause.stock = { [Op.gt]: 0 };
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchAutocomplete = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const suggestions = await Product.findAll({
      where: {
        title: {
          [Op.iLike]: `${q}%`, // Case-insensitive prefix match
        },
      },
      attributes: ['id', 'title'],
      limit: 10,
    });

    res.status(200).json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, searchProducts, searchAutocomplete };
