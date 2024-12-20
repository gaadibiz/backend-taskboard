'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
      contact_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contact_uuid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      customer_uuid: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      salutation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      designation: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      contact_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      extension: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      company_landline: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dob: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      previous_organisation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      skype_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      executive_location_line1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      executive_location_line2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      executive_location_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      executive_location_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      executive_location_pincode: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      executive_location_country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      contact_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      mail_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by_uuid: {
        type: Sequelize.STRING(50),
        allowNull: true,
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

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
