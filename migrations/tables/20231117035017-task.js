'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      task_user_taskboard_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      billing_company_uuid: {
        type: Sequelize.CHAR(50),
        allowNull: true,
      },
      billing_company_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_branch_uuid: {
        type: Sequelize.CHAR(50),
        allowNull: true,
      },
      billing_company_branch_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      type_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      type_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      upload_file: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      priority: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      time_taken: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      category_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      category_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      project_manager: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      assigned_to_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      assigned_to_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      insert_ts: {
        type: Sequelize.DATE,
        allowNull: true,
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
