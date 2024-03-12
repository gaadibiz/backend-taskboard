'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('module', [
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
        table_name: 'latest_project',
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
    ]);
    await queryInterface.sequelize.query(`UPDATE \`module\`
      SET map_column_user_uuid = '["created_by_uuid"]',
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
