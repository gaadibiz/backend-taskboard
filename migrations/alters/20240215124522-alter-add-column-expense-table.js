'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE expense ADD COLUMN actual_reimbursed_amount INT DEFAULT NULL AFTER requested_advance_amount;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE expense CHANGE COLUMN description description TEXT DEFAULT NULL;`,
    );
  },

  async down(queryInterface, Sequelize) {},
};
