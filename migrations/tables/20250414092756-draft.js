'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('draft', {
      draft_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      draft_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      draft_code: {
        type: Sequelize.STRING(100),
      },
      form_url: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      reference_data_uuid: {
        type: Sequelize.CHAR(36),
      },
      reference_data: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
