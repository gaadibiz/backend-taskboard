'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN delivery_type VARCHAR(100) after dispatch_address_country;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN dispatch_through VARCHAR(100) after delivery_type;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN transport_id VARCHAR(100) after dispatch_through;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN transport_doc_no VARCHAR(100) after transport_id;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN transport_doc_date VARCHAR(100) after transport_doc_no;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN vehicle_no VARCHAR(100) after transport_doc_date;`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE delivery_challan ADD COLUMN distance_for_eway VARCHAR(100) after vehicle_no;`,
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
