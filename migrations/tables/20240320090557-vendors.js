'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendors', {
      vendor_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vendor_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      billing_company_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      billing_company_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_branch_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_branch_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      vendor_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      registration_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      vendor_address_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      vendor_address_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      vendor_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      vendor_address_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      vendor_address_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      vendor_address_country: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      contact_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gst_in: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      mail_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bank_branch_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bank_account_no: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bank_ifsc_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      note: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      pan_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_by_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      modified_by_uuid: {
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

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
