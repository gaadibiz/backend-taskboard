'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN total_amount FLOAT DEFAULT 0 AFTER total_amount_after_tax;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN tcs FLOAT DEFAULT 0 AFTER total_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN tcs_amount FLOAT DEFAULT 0 AFTER tcs;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN discount FLOAT DEFAULT 0 AFTER tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE inventory ADD COLUMN discount_amount FLOAT DEFAULT 0 AFTER discount;`,
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
