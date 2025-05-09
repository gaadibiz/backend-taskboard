'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN taxable_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN cgst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN sgst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN igst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN gst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN cess_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN cess_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN state_cess_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN state_cess_rate;`,
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
