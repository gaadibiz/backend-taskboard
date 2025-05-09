'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN taxable_value;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN cgst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN sgst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN igst_rate;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory DROP COLUMN gst_amount;`,
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
