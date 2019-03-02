'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactionDetail = sequelize.define('transactionDetail', {
    transactionId: {
      type: DataTypes.INTEGER
    },
    catalogueId: {
      type: DataTypes.INTEGER
    },
    phonemodelId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    code: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    brand: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    caseType: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER
    }
  }, {});
  transactionDetail.associate = function(models) {
    // associations can be defined here
    transactionDetail.belongsTo(models.transaction, { foreignKey: `transactionId`})
    transactionDetail.belongsTo(models.catalogue, { foreignKey: `catalogueId`})
    transactionDetail.belongsTo(models.phonemodel, { foreignKey: `phonemodelId`})
  };
  return transactionDetail;
};