'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN billing_company_branch_state VARCHAR(500) AFTER billing_company_branch_name;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN billing_company_branch_country VARCHAR(500) AFTER billing_company_branch_state;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_type VARCHAR(500) AFTER billing_company_branch_country;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_registration_type VARCHAR(100) AFTER customer_name;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_address_line1 VARCHAR(500) AFTER customer_registration_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_address_line2 VARCHAR(500) AFTER customer_address_line1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_address_city VARCHAR(100) AFTER customer_address_line2;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_address_state VARCHAR(100) AFTER customer_address_city;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_address_pincode VARCHAR(100) AFTER customer_address_state;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN customer_address_country VARCHAR(500) AFTER customer_address_pincode;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_name VARCHAR(500) AFTER customer_address_country;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_address_line1 VARCHAR(500) AFTER delivery_name;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_address_line2 VARCHAR(500) AFTER delivery_address_line1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_address_city VARCHAR(100) AFTER delivery_address_line2;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_address_state VARCHAR(100) AFTER delivery_address_city;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_address_pincode VARCHAR(100) AFTER delivery_address_state;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN delivery_address_country VARCHAR(100) AFTER delivery_address_pincode;`,
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
