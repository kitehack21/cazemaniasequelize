'use strict';
module.exports = (sequelize, DataTypes) => {
  const phonemodel = sequelize.define('phonemodel', {
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
  phonemodel.associate = function(models) {
    // associations can be defined here
    phonemodel.belongsTo(models.brand, { foreignKey: `brandId`})

    phonemodel.hasMany(models.cart, { foreignKey: 'phonemodelId' })
    phonemodel.hasMany(models.transactionDetail, { foreignKey: 'phonemodelId' })
    phonemodel.hasMany(models.premiumModel, { foreignKey: 'phonemodelId' })

    phonemodel.belongsToMany(models.premium, { through: models.premiumModel, foreignKey: `phonemodelId` })
  };
  return phonemodel;
};