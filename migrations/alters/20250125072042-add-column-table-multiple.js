'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE proforma_invoice ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE purchase_order ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE quotation ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE sale_order ADD COLUMN tcs_sign VARCHAR(10) after tcs_amount;`,
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
