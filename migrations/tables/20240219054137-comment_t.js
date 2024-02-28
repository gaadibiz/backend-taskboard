'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment_t', {
      comment_t_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment_t_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      module_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      module_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      comment_remark: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      created_by_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_by_uuid: {
        type: Sequelize.STRING(50),
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
