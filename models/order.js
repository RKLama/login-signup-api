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

<<<<<<< HEAD
      // Order has many OrderItems
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items',
      });
=======
      Order.hasOne(models.Invoice, {
        foreignKey: 'orderId',
        as: 'invoice',
      });

      // Optionally, Order can have many OrderItems (if you implement that)
>>>>>>> feat/invoice
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
<<<<<<< HEAD
    total: DataTypes.FLOAT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
=======
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
<<<<<<< HEAD
>>>>>>> feat/invoice
=======
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending'
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true
>>>>>>> feat/update-payment-status
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
