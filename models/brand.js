'use strict';
module.exports = (sequelize, DataTypes) => {
  const brand = sequelize.define('brand', {
    name: {
      type: DataTypes.STRING
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  brand.associate = function(models) {
    // associations can be defined here
    brand.hasMany(models.model, { foreignKey: `brandId`})
  };
  return brand;
};