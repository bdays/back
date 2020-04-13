'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Auths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userName: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      salt: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.INTEGER,
      },
      sessionId: {
        type: Sequelize.STRING(4),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Auths'),
};
