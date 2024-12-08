'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense', {
      expense_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      expense_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      expense_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      job_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      job_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      job_order_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      project_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      project_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      project_manager_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      project_manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      finance_manager_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      finance_manager_uuid: {
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
      expense_category_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      expense_category_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category_manager_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category_manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      receipt: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      merchant: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      business_purpose: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      advance_amount: {
        type: Sequelize.INTEGER,
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
      expense_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      created_by_name: {
        type: Sequelize.STRING(100),
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

  async down(queryInterface, Sequelize) {},
};
