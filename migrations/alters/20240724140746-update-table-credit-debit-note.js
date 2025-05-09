'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN note_type VARCHAR(100) AFTER credit_debit_note_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN document_type VARCHAR(100) AFTER note_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN challan_no VARCHAR(100) AFTER return_quarter;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN challan_date VARCHAR(100) AFTER challan_no;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN lr_no VARCHAR(100) AFTER challan_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN eway_bill_no VARCHAR(100) AFTER lr_no;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN dispatch_through VARCHAR(100) AFTER eway_bill_no;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN transport_id VARCHAR(100) AFTER dispatch_through;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN transport_doc_no VARCHAR(100) AFTER transport_id;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN transport_doc_date VARCHAR(100) AFTER transport_doc_no;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN vehicle_no VARCHAR(100) AFTER transport_doc_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN term_and_condition VARCHAR(100) AFTER total_amount_in_words;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN bank_uuid VARCHAR(100) AFTER term_and_condition;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE credit_debit_note ADD COLUMN bank_name VARCHAR(100) AFTER bank_uuid;`,
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
