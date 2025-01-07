'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profile', {
      user_profile_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      personal_email: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      department_name: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      department_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      job_title: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      manager_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      manager_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      hierarchy_uuids: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      user_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      assigned_phone_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      shared_email: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      home_phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      linkedin_profile: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      hire_date: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      last_day_at_work: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      department: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      mother_maiden_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      photo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      signature: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      street_address: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      unit_or_suite: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      province_or_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      postal_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      languages_known: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      documents: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      branch_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      branch_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      father_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      mother_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      spouse_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      father_contact_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      mother_contact_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      spouse_contact_no: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      marital_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      attachment: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      bank_account_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          is: /^\d{10,15}$/,
        },
      },
      bank_ifsc_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      bank_branch: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      created_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      modified_by_uuid: {
        type: Sequelize.CHAR(36),
        allowNull: true,
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
