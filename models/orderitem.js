'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // OrderItem belongs to Product
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });

      // OrderItem belongs to Order
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
      });
    }
  }
  OrderItem.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
