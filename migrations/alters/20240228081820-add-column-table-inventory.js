'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN ack_no VARCHAR(100) AFTER inventory_uuid;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN ack_date datetime AFTER ack_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN irn VARCHAR(100) AFTER ack_date;`,
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN eway_bill_no VARCHAR(100) AFTER dated;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN delivery_note VARCHAR(500) AFTER eway_bill_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN mode_of_payment VARCHAR(100) AFTER delivery_note;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN reference_no VARCHAR(100) AFTER mode_of_payment;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN other_references VARCHAR(100) AFTER reference_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyers_order_no VARCHAR(100) AFTER other_references;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN dispatch_doc_no VARCHAR(100) AFTER buyers_order_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN delivery_note_date datetime AFTER dispatch_doc_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN dispatched_through VARCHAR(100) AFTER delivery_note_date;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN destination VARCHAR(100) AFTER dispatched_through;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN bill_of_lading VARCHAR(100) AFTER destination;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN motor_vehicle_no VARCHAR(100) AFTER bill_of_lading;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN products json AFTER motor_vehicle_no;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee VARCHAR(200) AFTER products;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_address_line1 VARCHAR(400) AFTER consignee;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_address_line2 VARCHAR(400) AFTER consignee_address_line1;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_address_city VARCHAR(100) AFTER consignee_address_line2;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_address_state VARCHAR(100) AFTER consignee_address_city;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_address_country VARCHAR(100) AFTER consignee_address_state;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_GSTIN VARCHAR(100) AFTER consignee_address_country;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_code VARCHAR(100) AFTER consignee_GSTIN;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN consignee_address_pincode VARCHAR(100) AFTER consignee_code;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer VARCHAR(200) AFTER consignee_address_pincode;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_address_line1 VARCHAR(400) AFTER buyer;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_address_line2 VARCHAR(400) AFTER buyer_address_line1;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_address_city VARCHAR(100) AFTER buyer_address_line2;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_address_state VARCHAR(100) AFTER buyer_address_city;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_address_country VARCHAR(100) AFTER buyer_address_state;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_GSTIN VARCHAR(100) AFTER buyer_address_country;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_code VARCHAR(100) AFTER buyer_GSTIN;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN buyer_address_pincode VARCHAR(100) AFTER buyer_code;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller VARCHAR(200) AFTER buyer_address_pincode;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_address_line1 VARCHAR(400) AFTER seller;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_address_line2 VARCHAR(400) AFTER seller_address_line1;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_address_city VARCHAR(100) AFTER seller_address_line2;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_address_state VARCHAR(100) AFTER seller_address_city;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_address_country VARCHAR(100) AFTER seller_address_state;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_GSTIN VARCHAR(100) AFTER seller_address_country;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_code VARCHAR(100) AFTER seller_GSTIN;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN seller_address_pincode VARCHAR(100) AFTER seller_code;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory ADD COLUMN bank_account_uuid VARCHAR(100) AFTER seller_address_pincode;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory DROP COLUMN product_name;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory DROP COLUMN product_for_uuid;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory DROP COLUMN quantity;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory DROP COLUMN price;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory DROP COLUMN product_for_name;`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory RENAME COLUMN po_number TO inv_invoice_no;`,
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
