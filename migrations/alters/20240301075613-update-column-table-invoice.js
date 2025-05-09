'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN supply_type_code VARCHAR(10) AFTER irn;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN document_type VARCHAR(10) AFTER payment_mode;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN eway_bill_date datetime AFTER eway_bill_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN valid_till_date datetime AFTER eway_bill_date;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN taxable_amount float AFTER invoice_items;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN cgst_amount float AFTER taxable_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN sgst_amount float AFTER cgst_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN igst_amount float AFTER sgst_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN cess_amount float AFTER igst_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices ADD COLUMN state_cess_amount float AFTER cess_amount;`,
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE invoices RENAME COLUMN full_amount TO round_off_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices DROP COLUMN roundoff_value;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invoices DROP COLUMN tax;`,
      );
    } catch (error) {
      console.log(error);
    }
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
