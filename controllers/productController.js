const { Op } = require('sequelize');
const { Product, Category } = require('../models');

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


module.exports = { getAllProducts, searchProducts, };
