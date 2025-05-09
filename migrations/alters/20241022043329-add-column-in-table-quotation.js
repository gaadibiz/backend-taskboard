'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE quotation ADD COLUMN tcs FLOAT DEFAULT 0 AFTER total_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE quotation ADD COLUMN tcs_amount FLOAT DEFAULT 0 AFTER tcs;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE quotation ADD COLUMN discount FLOAT DEFAULT 0 AFTER tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE quotation ADD COLUMN discount_amount FLOAT DEFAULT 0 AFTER discount;`,
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
