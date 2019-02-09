'use strict';
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('model', {
    name: {
      type: DataTypes.STRING
    },
    brandId: {
      type: DataTypes.INTEGER
    },
    soft: {
      type: DataTypes.BOOLEAN
    },
    hard: {
      type: DataTypes.BOOLEAN
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  model.associate = function(models) {
    // associations can be defined here
    model.belongsTo(models.brand, { foreignKey: `brandId`})

    // model.belongsToMany(models.premium, { through: models.premiumModel, foreignKey: `modelId` })
  };
  return model;
};