'use strict';
module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    'Auth',
    {
      userName: DataTypes.TEXT,
      passwordHash: DataTypes.TEXT,
      salt: DataTypes.TEXT,
      role: DataTypes.INTEGER,
      sessionId: DataTypes.STRING(4),
    },
    {},
  );
  Auth.associate = function(models) {
    // associations can be defined here
  };
  return Auth;
};
