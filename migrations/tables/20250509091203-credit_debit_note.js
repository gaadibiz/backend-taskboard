'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('credit_debit_note', {
      credit_debit_note_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      credit_debit_note_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      credit_debit_note_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      credit_debit_note_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      supplier_invoice_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      credit_debit_issue_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      invoice_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      invoice_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      return_month: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      return_quarter: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_branch_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_branch_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_branch_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_branch_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_gstin: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      place_of_supply: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      invoice_items: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      taxable_amount: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      total_tax: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      total_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      total_amount_in_words: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.STRING(100),
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
