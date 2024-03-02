'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "UPDATE `module` SET `map_column_user_uuid`='[\"created_by_uuid\",\"assigned_to_uuid\"]' WHERE table_name='latest_tasks' and submodule_name='Taskboard';",
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
