'use strict';

const { throwError } = require('../../utils/helperFunction');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let uuid = v4();
    const { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, SUPERADMIN_MOBILE } =
      process.env;
    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD)
      throwError(404, 'Either email or password is empty');
    await queryInterface.bulkInsert('user_fact', [
      {
        user_uuid: uuid,
        email: SUPERADMIN_EMAIL,
        status: 'ACTIVE',
      },
    ]);
    const admin = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_name = 'SUPERADMIN'`,
      )
    )[0][0];
    await queryInterface.bulkInsert('user_dim', [
      {
        user_uuid: uuid,
        user_password: bcrypt.hashSync(SUPERADMIN_PASSWORD, 10),
        role_uuid: admin.role_uuid,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
