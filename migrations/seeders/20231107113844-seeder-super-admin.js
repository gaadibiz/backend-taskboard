'use strict';

const { throwError } = require('../../common/helperFunction');
const bcrypt = require('bcrypt');

require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const {
      SUPERADMIN_EMAIL,
      SUPERADMIN_FIRST_NAME,
      SUPERADMIN_LAST_NAME,
      SUPERADMIN_PASSWORD,
      SUPERADMIN_MOBILE,
    } = process.env;
    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD)
      throwError(404, 'Either email or password is empty');
    await queryInterface.bulkInsert('user_fact', [
      {
        user_fact_id: 1,
        email: SUPERADMIN_EMAIL,
        status: 'ACTIVE',
      },
    ]);
    await queryInterface.bulkInsert('user_dim', [
      {
        user_fact_id: 1,
        first_name: SUPERADMIN_FIRST_NAME,
        last_name: SUPERADMIN_LAST_NAME,
        user_password: bcrypt.hashSync(SUPERADMIN_PASSWORD, 10),
        mobile_no: SUPERADMIN_MOBILE,
        role_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
