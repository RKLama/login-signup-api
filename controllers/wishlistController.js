const { Wishlist, Product } = require('../models');

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { userId, productId },
    });

    if (!created) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    res.status(201).json({ message: 'Product added to wishlist', wishlistItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product }],
    });

    res.status(200).json({ wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const deleted = await Wishlist.destroy({
      where: { userId, productId },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
