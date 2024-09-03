'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const approver_role_uuid = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'PROJECT_MANAGER'`,
      )
    )[0][0]?.role_uuid;

    await queryInterface.bulkInsert('approval_count', [
      {
        approval_count_uuid: uuidv4(),
        table_name: 'latest_report',
        level: 1,
        approval_hierarchy: `[[{ "type": "ROLE","uuid": "${approver_role_uuid}" }]]`,
        approval_raise_status: 'REPORT_APPROVAL_REQUESTED',
        previous_status: 'REPORT_REQUESTED',
        next_status: 'REPORT',
        status: 'ACTIVE',
        created_by_uuid: null,
      },
    ]);
    const finance_role_uuid = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'FINANCE_MANAGER'`,
      )
    )[0][0]?.role_uuid;

    await queryInterface.bulkInsert('approval_count', [
      {
        approval_count_uuid: uuidv4(),
        table_name: 'latest_report',
        level: 1,
        approval_hierarchy: `[[{ "type": "ROLE", "uuid": "${finance_role_uuid}" }]]`,
        approval_raise_status: 'FINANCE_APPROVAL_REQUESTED',
        previous_status: 'REPORT_APPROVAL_REQUESTED',
        next_status: 'FINANCE',
        status: 'ACTIVE',
        created_by_uuid: null,
      },
    ]);
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
