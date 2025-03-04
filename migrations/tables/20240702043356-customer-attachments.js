'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_attachment', {
      customer_attachment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_attachment_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customer_attachment_name: {
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
      is_vendor: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
