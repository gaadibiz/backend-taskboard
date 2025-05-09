'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_address_line1 VARCHAR(500) after delivery_address_country;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_address_line2 VARCHAR(500) after dispatch_address_line1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_address_city VARCHAR(200) after dispatch_address_line2;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_address_state VARCHAR(200) after dispatch_address_city;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_address_country VARCHAR(100) after dispatch_address_state;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_address_pincode VARCHAR(50) after dispatch_address_country;`,
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
