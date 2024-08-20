'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('table_reference', [
      {
        table_reference_uuid: uuidv4(),
        module_name: 'Approval',
        submodule_name: 'Approval',
        table_name: 'latest_approval',
        table_status: '["APPROVED","REJECTED","ROLLBACK","REQUESTED"]',
        create_ts: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
    await queryInterface.bulkInsert('table_reference', [
      {
        table_reference_uuid: uuidv4(),
        module_name: 'Approval',
        submodule_name: 'Approval Count',
        table_name: 'latest_approval_count',
        table_status: '["ACTIVE","INACTIVE"]',
        create_ts: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
    await queryInterface.bulkInsert('table_reference', [
      {
        table_reference_uuid: uuidv4(),
        module_name: 'Module',
        submodule_name: 'Module',
        table_name: 'latest_module',
        table_status: '[]',
        create_ts: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
    await queryInterface.bulkInsert('table_reference', [
      {
        table_reference_uuid: uuidv4(),
        module_name: 'Report',
        submodule_name: 'Report',
        table_name: 'latest_report',
        table_status:
          '["REPORT_REQUESTED","REPORT_APPROVAL_REQUESTED","REPORT","REJECTED","ROLLBACK","FINANCE_APPROVAL_REQUESTED","FINANCE"]',
        create_ts: Sequelize.literal('CURRENT_TIMESTAMP'),
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
