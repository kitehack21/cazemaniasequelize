'use strict';
module.exports = (sequelize, DataTypes) => {
  const premiumModel = sequelize.define('premiumModel', {
    catalogueId: {
      type: DataTypes.INTEGER
    },
    modelId: {
      type: DataTypes.INTEGER
    }
  }, {});
  premiumModel.associate = function(models) {
    // associations can be defined here
  };
  return premiumModel;
};