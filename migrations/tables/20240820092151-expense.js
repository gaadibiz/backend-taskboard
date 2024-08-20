'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense', {
      expense_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      expense_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      report_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      project_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      receipt: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      merchant: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      modified_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      create_ts: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      insert_ts: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
