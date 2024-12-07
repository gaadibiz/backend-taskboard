'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const modules = [
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers',
          table_name: 'latest_customer',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Job',
          table_name: 'latest_job',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers Branch',
          table_name: 'latest_customer_branch',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers Delivery Address',
          table_name: 'latest_customer_delivery_address',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers Dispatch Address',
          table_name: 'latest_customer_dispatch_address',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers Contacts',
          table_name: 'latest_contacts',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers Bank Details',
          table_name: 'latest_bank_details',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Customers Attachment',
          table_name: 'latest_customer_attachment',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Purchase Order',
          table_name: 'latest_purchase_order',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Quotation',
          table_name: 'latest_quotation',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Sale Order',
          table_name: 'latest_sale_order',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
        {
          module_uuid: uuidv4(),
          module_name: 'Job Board',
          submodule_name: 'Vendors',
          table_name: 'latest_vendors',
          map_column_user_uuid: JSON.stringify([]),
          column_relation_options: JSON.stringify([]),
          status: 'ACTIVE',
        },
      ];

      for (const module of modules) {
        try {
          await queryInterface.bulkInsert('module', [module], {});
        } catch (error) {
          console.error(`Error inserting module ${module.module_name}:`, error);
        }
      }

      await queryInterface.sequelize.query(`UPDATE \`module\`
        SET map_column_user_uuid = '["created_by_uuid", "modified_by_uuid"]',
            column_relation_options = '[{
                "api": "/user/get-user",
                "field": "email",
                "value": "user_uuid",
                "column_key": "user_uuid",
                "column_label": "User"
            }]' WHERE module_name = "Job Board" ;
      `);
    } catch (error) {
      console.error('Error during migration:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('module');
  },
};
