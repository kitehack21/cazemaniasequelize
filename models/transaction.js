'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    orderId: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER
    },
    bankId: {
      type: DataTypes.STRING
    },
    purchaseDate: {
      type: DataTypes.DATE
    },
    subtotal: {
      type: DataTypes.INTEGER
    },
    discount: {
      type: DataTypes.INTEGER
    },
    shipping: {
      type: DataTypes.INTEGER
    },
    totalPrice: {
      type: DataTypes.INTEGER
    },
    proof: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    resi: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    kota: {
      type: DataTypes.STRING
    },
    kodepos: {
      type: DataTypes.STRING
    },
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    }
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
    transaction.belongsTo(models.user, { foreignKey: `userId`})
    transaction.belongsTo(models.bank, { foreignKey: `bankId`})
    transaction.hasMany(models.transactionDetail, { foreignKey: `transactionId`})
  };
  return transaction;
};