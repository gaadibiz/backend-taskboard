'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice_export_data', {
      invoice_export_data_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      invoice_export_data_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      invoice_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      invoice_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ship_bill_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ship_bill_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ship_port_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      precarriage_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      place_of_precarriage: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      vessel_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      port_of_loading: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      port_of_discharge: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      final_destination: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country_of_origin: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country_of_final: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      weight: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      packages: {
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
