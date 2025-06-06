'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pt_establishment_id VARCHAR(200) AFTER esi_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN user_id VARCHAR(255) AFTER user_uuid;`);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
