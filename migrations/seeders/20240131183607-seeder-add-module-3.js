'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('module', [
      {
        module_uuid: uuidv4(),
        module_name: 'Project',
        submodule_name: 'Project',
        table_name: 'latest_project',
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
