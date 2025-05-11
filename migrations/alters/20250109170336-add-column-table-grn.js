'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN tcs FLOAT after total_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN tcs_amount FLOAT after tcs;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN discount FLOAT after tcs_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN discount_amount FLOAT after discount;`,
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
