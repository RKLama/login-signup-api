'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Each product belongs to a category
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });

      // Each product can be added to many cart items
      Product.hasMany(models.Cart, {
        foreignKey: 'productId',
        as: 'cartItems',
      });
    }
  }

  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};
