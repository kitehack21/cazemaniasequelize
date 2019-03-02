'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      bankId: {
        type: Sequelize.INTEGER
      },
      purchaseDate: {
        type: Sequelize.DATE
      },
      subtotal: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.INTEGER
      },
      shipping: {
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.INTEGER
      },
      proof: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      resi: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      kota: {
        type: Sequelize.STRING
      },
      kodepos: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};