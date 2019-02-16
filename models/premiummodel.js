'use strict';
module.exports = (sequelize, DataTypes) => {
  const premiumModel = sequelize.define('premiumModel', {
    catalogueId: {
      type: DataTypes.INTEGER
    },
    phonemodelId: {
      type: DataTypes.INTEGER
    },
    stock: {
      type: DataTypes.INTEGER
    }
  }, {});
  premiumModel.associate = function(models) {
    // associations can be defined here
    premiumModel.belongsTo(models.catalogue, { foreignKey: `catalogueId`})
    premiumModel.belongsTo(models.phonemodel, { foreignKey: `phonemodelId`})
  };
  return premiumModel;
};