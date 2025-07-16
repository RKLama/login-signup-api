'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Invoice belongs to an Order
      Invoice.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
      });
    }
  }

  Invoice.init({
    orderId: DataTypes.INTEGER,
    invoiceNumber: DataTypes.STRING,
    totalAmount: DataTypes.FLOAT,
    issuedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Invoice',
  });

  return Invoice;
};
