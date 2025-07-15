'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Belongs to Category
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });

      // 👇 Has many Reviews
      Product.hasMany(models.Review, {
        foreignKey: 'productId',
        as: 'reviews',
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
