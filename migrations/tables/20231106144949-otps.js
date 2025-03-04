'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'otps',
      {
        otps_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_uuid: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        otp_for: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        otp: {
          type: Sequelize.STRING(6),
          allowNull: false,
        },
        insert_ts: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        // Set a unique constraint on the combination of firstUniqueColumn and secondUniqueColumn
        uniqueKeys: {
          unique_combination: {
            fields: ['user_uuid', 'otp_for'],
          },
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('otps');
  },
};
