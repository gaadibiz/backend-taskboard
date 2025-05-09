'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN billing_company_branch_state VARCHAR(500) AFTER billing_company_branch_name;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN billing_company_branch_country VARCHAR(500) AFTER billing_company_branch_state;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN registration_type VARCHAR(500) AFTER document_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN vendor_address_line1 VARCHAR(500) AFTER registration_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN vendor_address_line2 VARCHAR(500) AFTER vendor_address_line1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN vendor_address_city VARCHAR(100) AFTER vendor_address_line2;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN vendor_address_state VARCHAR(100) AFTER vendor_address_city;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE debit_note ADD COLUMN vendor_address_pincode VARCHAR(100) AFTER vendor_address_state;`,
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
