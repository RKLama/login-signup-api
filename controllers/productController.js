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

module.exports = { getAllProducts};