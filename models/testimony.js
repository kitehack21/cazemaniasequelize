'use strict';
module.exports = (sequelize, DataTypes) => {
  const testimony = sequelize.define('testimony', {
    name: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {});
  testimony.associate = function(models) {
    // associations can be defined here
  };
  return testimony;
};