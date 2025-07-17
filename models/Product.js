'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
<<<<<<< HEAD
      // Each product belongs to a category
=======
      // Belongs to Category
>>>>>>> feat/reviews
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });

<<<<<<< HEAD
      // Each product can be added to many cart items
      Product.hasMany(models.Cart, {
        foreignKey: 'productId',
        as: 'cartItems',
=======
      // 👇 Has many Reviews
      Product.hasMany(models.Review, {
        foreignKey: 'productId',
        as: 'reviews',
>>>>>>> feat/reviews
      });
    }
  }

  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    salesCount: {
       type: DataTypes.INTEGER,
       defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};
