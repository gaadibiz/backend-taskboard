'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_dim', {
      user_dim_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      user_password: {
        type: Sequelize.STRING(5000),
        allowNull: false,
      },
      role_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
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
    await queryInterface.dropTable('user_dim');
  },
};
