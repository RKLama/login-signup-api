'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order belongs to a User
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // Order has many OrderItems
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items',
      });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
