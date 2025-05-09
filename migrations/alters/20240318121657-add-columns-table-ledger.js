'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.sequelize.query(
    //   `ALTER TABLE ledgers ADD COLUMN invoice_uuid VARCHAR(50) AFTER ledger_uuid;`,
    // );
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
