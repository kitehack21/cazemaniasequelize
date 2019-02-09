'use strict';
module.exports = (sequelize, DataTypes) => {
  const catalogue = sequelize.define('catalogue', {
    code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    sales: {
      type: DataTypes.INTEGER
    },
    category: {
      type: DataTypes.STRING
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  catalogue.associate = function(models) {
    // associations can be defined here
    catalogue.hasMany(models.cart, { foreignKey: `catalogueId`})
    catalogue.hasMany(models.premiumImage, { foreignKey: `catalogueId`})

  };
  return catalogue;
};