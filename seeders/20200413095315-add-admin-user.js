'use strict';

const argon2 = require('../util/argon2');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();

    const salt = 'salt';
    const hash = await argon2.hash('admin', salt);

    return queryInterface.bulkInsert('Auths', [
      {
        userName: 'admin',
        passwordHash: hash,
        salt,
        role: 1,
        createdAt: date,
        updatedAt: date,
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Auths', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
