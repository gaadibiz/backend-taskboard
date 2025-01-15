'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('module', [
      {
        module_uuid: uuidv4(),
        module_name: 'Tasks',
        submodule_name: 'Taskboard',
        table_name: 'latest_tasks',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      // {
      //   module_uuid: uuidv4(),
      //   module_name: 'Users',
      //   submodule_name: 'Users',
      //   table_name: 'latest_user',
      //   map_column_user_uuid: JSON.stringify([]),
      //   column_relation_options: JSON.stringify([]),
      //   status: 'ACTIVE',
      // },
      // {
      //   module_uuid: uuidv4(),
      //   module_name: 'Security',
      //   submodule_name: 'Security',
      //   table_name: 'role_module',
      //   map_column_user_uuid: JSON.stringify([]),
      //   column_relation_options: JSON.stringify([]),
      //   status: 'ACTIVE',
      // },
      {
        module_uuid: uuidv4(),
        module_name: 'Data Management',
        submodule_name: 'Branch',
        table_name: 'latest_branch',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },

      {
        module_uuid: uuidv4(),
        module_name: 'Admin',
        submodule_name: 'Users',
        table_name: 'latest_user',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Admin',
        submodule_name: 'Security',
        table_name: 'role_module',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Admin',
        submodule_name: 'Manage Site',
        table_name: 'latest_manage_site',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Tasks',
        submodule_name: 'Task List',
        table_name: 'latest_tasks',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Tasks',
        submodule_name: 'Schedule Task',
        table_name: 'latest_task_definition',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Tasks',
        submodule_name: 'Task Category',
        table_name: 'latest_category',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Tasks',
        submodule_name: 'Task Calender',
        table_name: 'latest_tasks',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Projects',
        submodule_name: 'Project',
        table_name: 'latest_project_with_team',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Expense',
        submodule_name: 'Expense',
        table_name: 'latest_expense',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Expense',
        submodule_name: 'Expense Category',
        table_name: 'latest_expense_category',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },

      {
        module_uuid: uuidv4(),
        module_name: 'Department',
        submodule_name: 'Department',
        table_name: 'latest_department',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company',
        table_name: 'latest_customer',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Job',
        table_name: 'latest_job',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company Branch',
        table_name: 'latest_customer_branch',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company Delivery Address',
        table_name: 'latest_customer_delivery_address',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company Dispatch Address',
        table_name: 'latest_customer_dispatch_address',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company Contacts',
        table_name: 'latest_contacts',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company Bank Details',
        table_name: 'latest_bank_details',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Company',
        submodule_name: 'Company Attachment',
        table_name: 'latest_customer_attachment',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Purchase Order',
        table_name: 'latest_purchase_order',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Quotation',
        table_name: 'latest_quotation',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Sale Order',
        table_name: 'latest_sale_order',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Job Board',
        submodule_name: 'Vendors',
        table_name: 'latest_vendors',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
    ]);

    await queryInterface.sequelize.query(`UPDATE \`module\`
      SET map_column_user_uuid = '["created_by_uuid","modified_by_uuid"]',
          column_relation_options = '[{
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
            }]';`);
    await queryInterface.sequelize.query(
      `UPDATE \`module\` SET map_column_user_uuid = '["created_by_uuid","modified_by_uuid","user_uuid"]' where table_name="latest_user" AND module_name='Admin' AND submodule_name = 'Users' ;`,
    );
    await queryInterface.sequelize.query(
      `UPDATE \`module\` SET map_column_user_uuid = '["created_by_uuid","modified_by_uuid","assigned_to_uuid","project_manager_uuid"]' where table_name="latest_tasks" AND submodule_name="Taskboard" AND module_name="Tasks";`,
    );
    await queryInterface.sequelize.query(
      `UPDATE \`module\` SET map_column_user_uuid = '["created_by_uuid", "project_manager_uuid","category_manager_uuid", "finance_manager_uuid","modified_by_uuid"]' where table_name="latest_expense" AND submodule_name="Expense" AND module_name="Expense";`,
    );
    await queryInterface.sequelize.query(
      `UPDATE \`module\` SET map_column_user_uuid = '["created_by_uuid","modified_by_uuid","department_head_uuid"]' where table_name="latest_department" AND submodule_name="Department" AND module_name="Department";`,
    );
    await queryInterface.sequelize.query(
      `UPDATE \`module\` SET map_column_user_uuid = '["created_by_uuid", "modified_by_uuid", "project_manager_uuid","user_uuid"]' where table_name="latest_project_with_team" AND submodule_name="Project" AND module_name="Project";`,
    );
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
