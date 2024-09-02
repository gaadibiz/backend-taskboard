'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('report', {
      report_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      project_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      project_name: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      project_manager_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      project_manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      department_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      department_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      report_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      business_purpose: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      advance_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reimbursed_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'REPORT_REQUESTED',
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

  async down(queryInterface, Sequelize) {},
};
