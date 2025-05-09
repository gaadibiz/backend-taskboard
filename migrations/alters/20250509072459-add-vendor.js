'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
  ALTER TABLE \`expense\` 
  ADD COLUMN \`payment_type\` VARCHAR(255) AFTER \`expense_type\`,
  ADD COLUMN \`vendor_name\` VARCHAR(255) AFTER \`vendor_uuid\`,
  ADD COLUMN \`vendor_advance_amount\` INT AFTER \`advance_amount\`,
  ADD COLUMN \`vendor_payable_amount\` INT AFTER \`vendor_advance_amount\`,
  ADD COLUMN \`net_vendor_payable_amount\` INT AFTER \`vendor_payable_amount\`
`);
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
