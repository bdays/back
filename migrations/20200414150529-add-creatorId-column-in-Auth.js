'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Auths', 'creatorId', Sequelize.INTEGER, {
      after: 'id', // after option is only supported by MySQL
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Auths', 'creatorId');
  },
};
