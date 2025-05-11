'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      invoice_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      invoice_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      invoice_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      invoice_no_aux: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      challan_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      challan_date: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      po_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      po_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      invoice_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      project_site: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ack_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ack_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      irn: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      supply_type_code: {
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
      eway_bill_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      valid_till_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      vehicle_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      payment_mode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      document_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      region: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      place_of_supply: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_branch_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_branch_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_branch_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_registration_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_branch_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_branch_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_gstin: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_address_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      customer_address_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      customer_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_address_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_address_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_address_country: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      dispatch_address_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      dispatch_address_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      dispatch_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dispatch_address_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      dispatch_address_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      dispatch_address_country: {
        type: Sequelize.STRING(50),
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
      advising_bank_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      advising_bank_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sales_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      approved_flag: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      invoice_items: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      is_round_off: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      term_and_condition: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      total_amount_after_tax: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      delivery_address_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      delivery_address_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      delivery_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      delivery_address_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      delivery_address_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      delivery_address_country: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      qr_code: {
        type: Sequelize.STRING(500),
        allowNull: true,
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
