'use strict';
module.exports = (sequelize, DataTypes) => {
  const premiumModel = sequelize.define('premiumModel', {
    catalogueId: DataTypes.INTEGER,
    modelId: DataTypes.INTEGER
  }, {});
  premiumModel.associate = function(models) {
    // associations can be defined here
  };
  return premiumModel;
};