'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Templates', 'text', {
      type: Sequelize.TEXT(),
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Templates', 'text', {
      type: Sequelize.STRING(),
    });
  },
};
