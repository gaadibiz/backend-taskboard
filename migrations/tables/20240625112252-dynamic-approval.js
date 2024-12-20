'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dynamic_approval', {
      dynamic_approval_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dynamic_approval_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      current_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      table_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      dynamic_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      record_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      record_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      record_column_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      approval_uuids: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      requested_by_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      previous_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      next_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      remark: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      created_by_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      create_ts: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
