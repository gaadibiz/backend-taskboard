'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_expense', {
      vendor_expense_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vendor_expense_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      expense_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      vendor_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      vendor_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_uuid: {
        type: Sequelize.CHAR(50),
        allowNull: false,
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
      actual_advance_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      requested_advance_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reimbursed_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      eligible_reimbursement_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      actual_reimbursed_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      actual_requested_advance_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_deduct_from_advance: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expense_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      additional_fields: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      special_approval_uuids: {
        type: Sequelize.JSON,
        allowNull: true,
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
