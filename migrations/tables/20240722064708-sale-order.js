'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sale_order', {
      sale_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sale_order_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      sale_order_no: {
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
      sale_order_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      reference_no: {
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
      delivery_address_name: {
        type: Sequelize.STRING(500),
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
      contact_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      contact_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      delivery_type: {
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
      vehicle_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      completion_date: {
        type: Sequelize.STRING(50),
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
      status: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      create_ts: {
        type: Sequelize.DATE,
        allowNull: false,
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
