'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_challan', {
      delivery_challan_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      delivery_challan_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      delivery_challan_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      delivery_challan_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      lr_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      eway_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reason_for_eway: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      delivery_mode: {
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
      customer_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_name: {
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
