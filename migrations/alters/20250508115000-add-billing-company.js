'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`user_dim\` 
      ADD COLUMN \`affiliated_billing_company_uuids\` JSON after \`role_uuid\`,
      ADD COLUMN \`billing_company_branches\` JSON AFTER \`affiliated_billing_company_uuids\`
    `);
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
