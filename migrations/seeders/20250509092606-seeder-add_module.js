'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('module', [
      {
        module_uuid: uuidv4(),
        module_name: 'Products',
        submodule_name: 'Products',
        table_name: 'latest_product',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Ledger',
        submodule_name: 'Ledger',
        table_name: 'latest_ledger',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Invoice',
        submodule_name: 'Invoice',
        table_name: 'latest_invoices',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Proforma Invoice',
        submodule_name: 'Proforma Invoice',
        table_name: 'latest_proforma_invoices',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Delivery Challan',
        submodule_name: 'Delivery Challan',
        table_name: 'latest_delivery_challan',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Inventory',
        submodule_name: 'Inventory',
        table_name: 'latest_inventory',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Invoice',
        submodule_name: 'Invoice Export Data',
        table_name: 'latest_invoice_export_data',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'GRN',
        submodule_name: 'GRN',
        table_name: 'latest_grn',
        map_column_user_uuid: '["approved_by_uuid"]',
        column_relation_options: `[{
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
      }]`,
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Credit Debit Note',
        submodule_name: 'Debit Note',
        table_name: 'latest_debit_note',
        map_column_user_uuid: '["approved_by_uuid"]',
        column_relation_options: `[{
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
      }]`,
        status: 'ACTIVE',
      },
      {
        module_uuid: uuidv4(),
        module_name: 'Credit Debit Note',
        submodule_name: 'Credit Debit Note',
        table_name: 'latest_credit_debit_note',
        map_column_user_uuid: JSON.stringify([]),
        column_relation_options: JSON.stringify([]),
        status: 'ACTIVE',
      },
    ]);
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
