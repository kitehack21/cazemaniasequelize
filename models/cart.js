'use strict';
module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define('cart', {
    userId: {
      type: DataTypes.INTEGER
    },
    catalogueId: {
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
    amount: {
      type: DataTypes.INTEGER
    }
  }, {});
  cart.associate = function(models) {
    // associations can be defined here
    cart.belongsTo(models.user, { foreignKey: `userId`})
    cart.belongsTo(models.catalogue, { foreignKey: `catalogueId`})
  };
  return cart;
};