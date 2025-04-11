'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE purchase_order ADD COLUMN priority VARCHAR(100) DEFAULT NULL AFTER remark;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE job ADD COLUMN priority  VARCHAR(100) DEFAULT NULL AFTER vendor_name;`,
    );
  },

  async down(queryInterface, Sequelize) {},
};
