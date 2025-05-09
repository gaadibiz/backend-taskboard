'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('debit_note', {
      debit_note_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      debit_note_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      debit_note_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      debit_note_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      document_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      debit_note_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      supplier_invoice_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      debit_issue_date: {
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
      challan_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      challan_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      lr_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      eway_bill_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      delivery_options: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dispatch_through: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      transport_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      transport_doc_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      transport_doc_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      vehicle_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_uuid: {
        type: Sequelize.CHAR(36),
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
      vendor_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      vendor_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      vendor_gstin: {
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
      tcs: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      tcs_amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      discount_amount: {
        type: Sequelize.FLOAT,
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
      term_and_condition: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      bank_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
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
