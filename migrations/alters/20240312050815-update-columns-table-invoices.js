'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN cgst_rate float AFTER cgst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN sgst_rate float AFTER sgst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN igst_rate float AFTER igst_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN cess_rate float AFTER cess_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN state_cess_rate float AFTER state_cess_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices DROP COLUMN discount_type;`,
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
