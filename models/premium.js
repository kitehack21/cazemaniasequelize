'use strict';
module.exports = (sequelize, DataTypes) => {
  const premium = sequelize.define('premium', {
    name: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    }
  }, {});
  premium.associate = function(models) {
    // associations can be defined here
    premium.hasMany(models.catalogue, { foreignKey: `premiumId`})
    premium.hasMany(models.premiumImage, { foreignKey: `premiumId`})
  };
  return premium;
};