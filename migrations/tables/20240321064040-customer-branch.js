'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_branch', {
      customer_branch_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_branch_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_branch_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customer_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customer_branch_gst_in: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      pan_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      invoice_no_sequence: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_branch_address_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      customer_branch_address_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      customer_branch_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_branch_address_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_branch_address_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_branch_address_country: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_branch_mobile: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      customer_branch_phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      customer_branch_website: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_branch_mail_id: {
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

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
