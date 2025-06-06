'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE history ADD COLUMN modified_by_uuid CHAR(36)  NULL AFTER created_by_uuid;`);
    await queryInterface.sequelize.query(`ALTER TABLE history ADD COLUMN payload JSON NULL AFTER message;`);
    await queryInterface.sequelize.query(`ALTER TABLE history ADD COLUMN status VARCHAR(20)  NULL AFTER payload;`);
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
