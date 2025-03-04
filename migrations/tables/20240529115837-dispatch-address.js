'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_dispatch_address', {
      customer_dispatch_address_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_dispatch_address_uuid: {
        type: Sequelize.STRING(50),
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
      dispatch_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_dispatch_address_line1: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      customer_dispatch_address_line2: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      customer_dispatch_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_dispatch_address_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_dispatch_address_pincode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customer_dispatch_address_country: {
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
