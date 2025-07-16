'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // A Cart item belongs to a User
      Cart.belongsTo(models.User, { foreignKey: 'userId' });

      // A Cart item refers to a Product
      Cart.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  Cart.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};
