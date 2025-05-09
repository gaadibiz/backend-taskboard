'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN cgst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN igst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN sgst_amount;`,
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
