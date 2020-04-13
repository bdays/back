'use strict';

const argon2 = require('../util/argon2');
const jwt = require('../util/jwt');

const userName = 'admin';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();

    const salt = argon2.generateSecret();
    const hash = await argon2.hash('adminadmin', salt);

    return queryInterface.bulkInsert('Auths', [
      {
        userName,
        passwordHash: hash,
        salt,
        role: 1,
        sessionId: jwt.generateSessionId(),
        createdAt: date,
        updatedAt: date,
      },
    ]);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Auths', [{ userName }], {}),
};
