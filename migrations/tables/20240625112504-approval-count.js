'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_count', {
      approval_count_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      approval_count_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      table_name: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      link_table: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      link_column: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      approval_hierarchy: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      approval_raise_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      previous_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      next_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
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
