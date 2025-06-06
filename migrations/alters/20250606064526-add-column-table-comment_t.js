'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE comment_t ADD COLUMN module_uuid CHAR(36)  NULL AFTER record_uuid;`);
    await queryInterface.sequelize.query(`ALTER TABLE comment_t ADD COLUMN module_name VARCHAR(100)  NULL AFTER module_uuid;`);
    await queryInterface.sequelize.query(`ALTER TABLE comment_t ADD COLUMN table_name VARCHAR(100)  NULL AFTER record_uuid;`);

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
