'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_id: 1,
        role_name: 'SUPERADMIN',
      },
      {
        role_name: 'ADMIN',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
