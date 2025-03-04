'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bank_details', {
      bank_details_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bank_details_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      branch: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      account_no: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ifsc_code: {
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
