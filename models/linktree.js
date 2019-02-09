'use strict';
module.exports = (sequelize, DataTypes) => {
  const linktree = sequelize.define('linktree', {
    name: DataTypes.STRING,
    link: DataTypes.STRING
  }, {});
  linktree.associate = function(models) {
    // associations can be defined here
  };
  return linktree;
};