'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN cgst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN sgst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN igst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN gst_amount float AFTER igst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN total_amount float AFTER gst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN is_round_off float AFTER total_amount;`,
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
