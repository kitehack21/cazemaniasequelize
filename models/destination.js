'use strict';
module.exports = (sequelize, DataTypes) => {
  const destination = sequelize.define('destination', {
    destination_code: {
      type: DataTypes.STRING
    },
    subdistrict: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    province: {
      type: DataTypes.STRING
    }
  }, {});
  destination.associate = function(models) {
    // associations can be defined here
  };
  return destination;
};