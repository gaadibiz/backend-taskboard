'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('table_reference', {
      table_reference_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      table_reference_unique_id: {
        type: Sequelize.INTEGER,
      },
      table_reference_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      module_name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      submodule_name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      table_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      table_status: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: ['ACTIVE', 'INACTIVE'],
      },
      create_ts: {
        type: Sequelize.DATE,
        allowNull: false,
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
