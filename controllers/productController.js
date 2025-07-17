<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const { Product, Category } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
=======
=======
const { Op } = require('sequelize');
>>>>>>> feat/admin-dashboard
const Product = require('../models/Product);
=======
const { Op } = require('sequelize');
const { Product, Category } = require('../models');
>>>>>>> feat/product-search

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

<<<<<<< HEAD
<<<<<<< HEAD
module.exports = { getAllProducts};
>>>>>>> feat/product
=======
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
=======
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
>>>>>>> feat/product-search
    res.status(500).json({ message: 'Server error' });
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
module.exports = { getAllProducts, searchProducts };
>>>>>>> feat/admin-dashboard
=======

module.exports = { getAllProducts, searchProducts, };
>>>>>>> feat/product-search
=======
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
>>>>>>> feat/search-autocomplete
