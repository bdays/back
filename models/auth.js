'use strict';
module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    'Auth',
    {
      userName: DataTypes.STRING,
      passwordHash: DataTypes.STRING,
      salt: DataTypes.STRING,
      role: DataTypes.INTEGER,
    },
    {},
  );
  Auth.associate = function(models) {
    // associations can be defined here
  };
  return Auth;
};
