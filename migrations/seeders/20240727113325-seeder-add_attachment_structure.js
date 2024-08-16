'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('attachments_structure', [
      {
        module_name: 'TASKS',
        file_path:
          'tasks/${as_payload.title}/${as_payload.file_name}${as_payload.title}${moment().format("YYYY-MM-DD")}_${moment().format("HH-mm-ss")}.${as_payload.file_ext}',
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
