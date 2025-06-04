'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('country_state', {
      country_state_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_state_unique_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      country_id: {
        type: Sequelize.INTEGER,
      },
      country_state_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      country_name: {
        type: Sequelize.STRING(255),
      },
      state_name: {
        type: Sequelize.STRING(255),
      },
      county_code: {
        type: Sequelize.STRING(255),
      },
      state_code: {
        type: Sequelize.STRING(255),
      },
      type: {
        type: Sequelize.STRING(255),
      },
      latitude: {
        type: Sequelize.STRING(255),
      },
      longitude: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      created_by_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      modified_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      modified_by_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      create_ts: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      insert_ts: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
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
