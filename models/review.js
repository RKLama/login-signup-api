'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // 👇 Each review belongs to one user
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // 👇 Each review belongs to one product
      Review.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }

  Review.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
  });

  return Review;
};
