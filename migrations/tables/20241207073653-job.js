'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job', {
      job_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      job_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      job_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      job_order_no: {
        type: Sequelize.STRING(100),
      },
      job_order_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      project_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      project_manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      project_manager_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      finance_manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      finance_manager_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      vendor_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      vendor_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
