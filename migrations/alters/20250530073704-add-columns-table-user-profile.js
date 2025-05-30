'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN email VARCHAR(255)  NULL AFTER personal_email;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN middle_name VARCHAR(255)  NULL AFTER last_name;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN gender VARCHAR(255)  NULL AFTER personal_email;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN legal_entity VARCHAR(255)  NULL AFTER email;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN sub_department VARCHAR(255)  NULL AFTER legal_entity;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN business_unit VARCHAR(255)  NULL AFTER sub_department;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN secondary_job_title VARCHAR(255)  NULL AFTER business_unit;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN reporting_manager_employee_no VARCHAR(255)  NULL AFTER secondary_job_title;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN skype_id VARCHAR(255)  NULL AFTER reporting_manager_employee_no;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN marriage_date VARCHAR(255)  NULL AFTER skype_id;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN spouse_gender VARCHAR(255)  NULL AFTER spouse_name;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN is_physically_handicapped BOOLEAN  NULL AFTER spouse_gender;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN blood_group VARCHAR(255)  NULL AFTER is_physically_handicapped;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN nationality VARCHAR(255)  NULL AFTER blood_group;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN salary_payment_mode VARCHAR(255)  NULL AFTER nationality;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN bank_account_name VARCHAR(255)  NULL AFTER bank_account_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pf_establishment_id VARCHAR(255)  NULL AFTER bank_account_name;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pf_details_available BOOLEAN  NULL AFTER pf_establishment_id;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pf_number VARCHAR(255)  NULL AFTER pf_details_available;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pf_account_name VARCHAR(255)  NULL AFTER pf_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN uan VARCHAR(255)  NULL AFTER pf_account_name;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN esi_eligible BOOLEAN  NULL AFTER uan;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN employee_esi_number VARCHAR(255)  NULL AFTER esi_eligible;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN esi_details_available VARCHAR(255)  NULL AFTER employee_esi_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN esi_number VARCHAR(255)  NULL AFTER esi_details_available;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN lwf_eligible BOOLEAN  NULL AFTER esi_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN aadhaar_number VARCHAR(255)  NULL AFTER bank_account_name;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN enrollment_number VARCHAR(255)  NULL AFTER aadhaar_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN dob_in_aadhaar_card VARCHAR(255)  NULL AFTER enrollment_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN full_name_as_per_aadhaar_card VARCHAR(255)  NULL AFTER dob_in_aadhaar_card;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN address_as_in_aadhaar_card VARCHAR(255)  NULL AFTER full_name_as_per_aadhaar_card;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN gender_as_in_aadhaar_card VARCHAR(255)  NULL AFTER address_as_in_aadhaar_card;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pan_card_available BOOLEAN  NULL AFTER gender_as_in_aadhaar_card;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN pan_number VARCHAR(255)  NULL AFTER pan_card_available;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN full_name_as_per_pan_card VARCHAR(255)  NULL AFTER pan_number;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN dob_in_pan_card VARCHAR(255)  NULL AFTER full_name_as_per_pan_card;`);
    await queryInterface.sequelize.query(`ALTER TABLE user_profile ADD COLUMN parents_name_as_per_pan_card VARCHAR(255)  NULL AFTER dob_in_pan_card;`);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
