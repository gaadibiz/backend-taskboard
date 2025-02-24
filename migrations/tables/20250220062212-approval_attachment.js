'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_attachment', {
      approval_attachment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      approval_attachment_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      approval_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      approval_status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      approval_next_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      approval_comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      record_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      attachment: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      created_by_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
