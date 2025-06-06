'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('module', [
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Vendor Expense',
        table_name: 'latest_vendor_expense',
        map_column_user_uuid: '["created_by_uuid","modified_by_uuid"]',
        column_relation_options: `[{
                  "api": "/user/get-user",
                  "field": "email",
                  "value": "user_uuid",
                  "column_key": "user_uuid",
                  "column_label": "User"
              },{
                "api": "/user/get-branch", 
                "field": "branch_name", 
                "value": "branch_uuid",
                "column_key": "branch_uuid",
                "column_label": "Branch"
                }]`,
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Vendor Expense Category',
        table_name: 'latest_vendor_expense_category',
        map_column_user_uuid: '["user_uuid","created_by_uuid","project_manager_uuid","category_manager_uuid","finance_manager_uuid","modified_by_uuid","special_approval_uuids"]',
        column_relation_options: `[{
                  "api": "/user/get-user",
                  "field": "email",
                  "value": "user_uuid",
                  "column_key": "user_uuid",
                  "column_label": "User"
              },{
                "api": "/user/get-branch", 
                "field": "branch_name", 
                "value": "branch_uuid",
                "column_key": "branch_uuid",
                "column_label": "Branch"
                }]`,
        status: 'ACTIVE',
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
