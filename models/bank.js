'use strict';
module.exports = (sequelize, DataTypes) => {
  const bank = sequelize.define('bank', {
    name: {
      type: DataTypes.STRING
    },
    accountNumber: {
      type: DataTypes.STRING
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  bank.associate = function(models) {
    // associations can be defined here
    bank.hasMany(models.transaction, { foreignKey: 'bankId' })
  };
  return bank;
};