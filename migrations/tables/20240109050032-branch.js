'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branch', {
      branch_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      branch_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      branch_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      insert_ts: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
