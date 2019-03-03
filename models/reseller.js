'use strict';
module.exports = (sequelize, DataTypes) => {
  const reseller = sequelize.define('reseller', {
    userId: {
      type: DataTypes.INTEGER
    },
    isResolved: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  reseller.associate = function(models) {
    // associations can be defined here
    reseller.belongsTo(models.user, { foreignKey: `userId`})
  };
  return reseller;
};