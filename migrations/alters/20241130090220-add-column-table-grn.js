'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN grn_date VARCHAR(100) after grn_no;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN project VARCHAR(100) after grn_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE grn ADD COLUMN attachments JSON after total_amount_after_tax;`,
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
