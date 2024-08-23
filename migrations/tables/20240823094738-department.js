'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('department', {
      department_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      department_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      department_head_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      department_head_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      department_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      department_details: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      modified_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      create_ts: {
        type: Sequelize.DATE,
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
