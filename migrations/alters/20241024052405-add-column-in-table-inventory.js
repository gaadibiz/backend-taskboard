'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN grn_no VARCHAR(50) after purchase_invoice_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN grn_uuid char(36) after grn_no;`,
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
