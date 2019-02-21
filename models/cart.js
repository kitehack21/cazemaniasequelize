'use strict';
module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define('cart', {
    userId: {
      type: DataTypes.INTEGER
    },
    catalogueId: {
      type: DataTypes.INTEGER
    },
    phonemodelId: {
      type: DataTypes.INTEGER
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
    price: {
      type: DataTypes.INTEGER
    },
    amount: {
      type: DataTypes.INTEGER
    }
  }, {});
  cart.associate = function(models) {
    // associations can be defined here
    cart.belongsTo(models.user, { foreignKey: `userId`})
    cart.belongsTo(models.catalogue, { foreignKey: `catalogueId`})
    cart.belongsTo(models.phonemodel, { foreignKey: `phonemodelId`})
  };
  return cart;
};