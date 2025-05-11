'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('billing_company', {
      billing_company_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      billing_company_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      billing_company_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      billing_company_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      billing_company_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      billing_company_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      billing_company_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      billing_company_country: {
        type: Sequelize.STRING(50),
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
        allowNull: true,
      },
      branch: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      account_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      swift_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ifsc_code: {
        type: Sequelize.STRING(100),
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('categories');
  },
};
