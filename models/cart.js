'use strict';
module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define('cart', {
    userId: {
      type: DataTypes.INTEGER
    },
    cartType: {
      type: DataTypes.STRING
    },
    catalogueId: {
      type: DataTypes.INTEGER
    },
    brand: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.INTEGER
    },
    caseType: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.STRING
    }
  }, {});
  cart.associate = function(models) {
    // associations can be defined here
    cart.belongsTo(models.user, { foreignKey: `userId`})
    cart.belongsTo(models.catalogue, { foreignKey: `catalogueId`})
  };
  return cart;
};