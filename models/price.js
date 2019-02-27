'use strict';
module.exports = (sequelize, DataTypes) => {
  const price = sequelize.define('price', {
    case_type: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER
    },
    resellerPrice: {
      type: DataTypes.INTEGER
    }
  }, {});
  price.associate = function(models) {
    // associations can be defined here
  };
  return price;
};