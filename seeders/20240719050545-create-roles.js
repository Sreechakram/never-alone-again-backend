'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        uuid: uuidv4(),
        roleName: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        uuid: uuidv4(),
        roleName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
