'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN invoice_date VARCHAR(50) after challan_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN delivery_challan_no VARCHAR(50) after invoice_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE invoices ADD COLUMN delivery_challan_uuid char(36) after delivery_challan_no;`,
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
