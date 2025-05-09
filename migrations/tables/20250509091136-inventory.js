'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventory', {
      inventory_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventory_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      purchase_invoice_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dated: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      inv_invoice_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      challan_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      challan_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      po_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      eway_bill_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      lr_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      delivery_note: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      mode_of_payment: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reference_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      other_references: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyers_order_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dispatch_doc_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      delivery_note_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dispatched_through: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      destination: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bill_of_lading: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      motor_vehicle_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      products: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      total_amount_after_tax: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      consignee_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      consignee_branch_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_branch_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      consignee_address_line1: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      consignee_address_line2: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      consignee_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_address_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_address_country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_GSTIN: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      consignee_address_pincode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      buyer_branch_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_branch_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      buyer_address_line1: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      buyer_address_line2: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      buyer_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_address_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_address_country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_GSTIN: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      buyer_address_pincode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      vendor_registration_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_branch_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_branch_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      seller_address_line1: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      seller_address_line2: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      seller_address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_address_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_address_country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_GSTIN: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      seller_address_pincode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dispatch_through: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      transport_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      transport_doc_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      transport_doc_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bank_account_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bank_account_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      document: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      create_ts: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      insert_ts: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory');
  },
};
