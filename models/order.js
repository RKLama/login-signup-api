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

      Order.hasOne(models.Invoice, {
        foreignKey: 'orderId',
        as: 'invoice',
      });

      // Optionally, Order can have many OrderItems (if you implement that)
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending'
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
