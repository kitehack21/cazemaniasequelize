'use strict';
module.exports = (sequelize, DataTypes) => {
  const premiumImage = sequelize.define('premiumImage', {
    catalogueId: {
      type: DataTypes.INTEGER
    },
    image: {
      type: DataTypes.STRING
    }
  }, {});
  premiumImage.associate = function(models) {
    // associations can be defined here
    // premiumImage.belongsTo(models.premium, { foreignKey: `catalogueId`})

  };
  return premiumImage;
};