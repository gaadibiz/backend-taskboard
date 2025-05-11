'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ledgers', {
      ledger_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ledger_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      invoice_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      product_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      selling_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      invoice_no: {
        type: Sequelize.STRING(50),
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
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
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
    await queryInterface.dropTable('ledgers');
  },
};
