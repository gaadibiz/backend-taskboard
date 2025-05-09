'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE products DROP COLUMN bought_price;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE products DROP COLUMN marked_price;`,
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
