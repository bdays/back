'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Templates', 'title', {
      type: Sequelize.TEXT(),
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Templates', 'title', {
      type: Sequelize.STRING(),
    });
  },
};
