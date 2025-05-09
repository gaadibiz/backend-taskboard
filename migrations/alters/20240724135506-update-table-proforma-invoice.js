'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE proforma_invoice ADD COLUMN dispatch_through VARCHAR(100) AFTER valid_till_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE proforma_invoice ADD COLUMN transport_id VARCHAR(100) AFTER dispatch_through;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE proforma_invoice ADD COLUMN transport_doc_no VARCHAR(100) AFTER transport_id;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE proforma_invoice ADD COLUMN transport_doc_date VARCHAR(100) AFTER transport_doc_no;`,
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
