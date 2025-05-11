'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN HSN VARCHAR(100) AFTER products;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN taxable_value float AFTER HSN;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN cgst_rate float AFTER taxable_value;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN cgst_amount float AFTER cgst_rate;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN sgst_rate float AFTER cgst_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN sgst_amount float AFTER sgst_rate;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN igst_rate float AFTER sgst_amount;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN igst_amount float AFTER igst_rate;`,
      );
    } catch (error) {
      console.log(error);
    }
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
