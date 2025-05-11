'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN tcs FLOAT DEFAULT 0 AFTER total_value;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN tcs_amount FLOAT DEFAULT 0 AFTER tcs;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN discount FLOAT DEFAULT 0 AFTER tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN discount_amount FLOAT DEFAULT 0 AFTER discount;`,
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
