'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer', {
      customer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      organization_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_billing_company: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customer_website: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      legal_entity: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      registration_type: {
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
