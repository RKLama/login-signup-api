'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    }
  }
  Payment.init({
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'mock'
    },
    paymentDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};
