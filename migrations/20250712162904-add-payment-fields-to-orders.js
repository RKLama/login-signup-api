'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending',
      allowNull: false,
    });

    await queryInterface.addColumn('Orders', 'paymentReference', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'paymentReference');
    await queryInterface.removeColumn('Orders', 'paymentStatus');
  }
};
