'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_definition', {
      task_definition_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_definition_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      task_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      task_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      task_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      task_day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      task_weekdays: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      task_day_of_month: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      task_month: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      task_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      task_interval: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      type_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
      category_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      category_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      assigned_to_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      assigned_to_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
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
