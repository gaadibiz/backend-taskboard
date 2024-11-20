'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_id: 1,
        role_name: 'Superadmin',
        role_value: 'SUPERADMIN',
        role_uuid: uuidv4(),
        role_group: 'ALL',
      },
      {
        role_name: 'Admin',
        role_value: 'ADMIN',
        role_uuid: uuidv4(),
        role_group: 'ALL',
      },
      {
        role_name: 'Project Manager',
        role_value: 'PROJECT_MANAGER',
        role_uuid: uuidv4(),
        role_group: 'MANAGER',
      },
      {
        role_name: 'User',
        role_value: 'USER',
        role_uuid: uuidv4(),
        role_group: 'USER',
      },
      {
        role_name: 'Finance Manager',
        role_value: 'FINANCE_MANAGER',
        role_uuid: uuidv4(),
        role_group: 'USER',
      },
      {
        role_name: 'Category Manager',
        role_value: 'CATEGORY_MANAGER',
        role_uuid: uuidv4(),
        role_group: 'USER',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
