'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    kota: {
      type: DataTypes.STRING
    },
    kodepos: {
      type: DataTypes.STRING
    },
    destination_code: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    }
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.cart, { foreignKey: `userId`})
    user.hasMany(models.transaction, { foreignKey: `userId`})
  };
  return user;
};