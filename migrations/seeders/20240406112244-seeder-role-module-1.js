'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const modules = (
      await queryInterface.sequelize.query(`SELECT * FROM \`module\``)
    )[0];
    const superadmin = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'SUPERADMIN'`,
      )
    )[0][0];
    const admin = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'ADMIN'`,
      )
    )[0][0];
    let roleSecurity = [];
    // superadmin
    for (const module of modules) {
      roleSecurity.push({
        role_module_uuid: uuidv4(),
        module_uuid: module.module_uuid,
        role_uuid: superadmin.role_uuid,
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        bulk_import: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: JSON.stringify({ or: { user_uuid: ['*'] } }),
      });
    }
    // admin
    for (const module of modules) {
      roleSecurity.push({
        role_module_uuid: uuidv4(),
        module_uuid: module.module_uuid,
        role_uuid: admin.role_uuid,
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        bulk_import: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: JSON.stringify({ or: { user_uuid: ['*'] } }),
      });
    }

    // project
    const project_module_name = ['Projects', 'Tasks'];
    const project_module = modules.filter((module) =>
      project_module_name.includes(module.module_name),
    );
    const project_manager = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'PROJECT_MANAGER'`,
      )
    )[0][0];

    for (const module of project_module) {
      roleSecurity.push({
        role_module_uuid: uuidv4(),
        module_uuid: module.module_uuid,
        role_uuid: project_manager.role_uuid,
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        bulk_import: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: JSON.stringify({ or: { user_uuid: ['*'] } }),
      });
    }

    // user
    const user_module_name = ['Tasks'];
    const user_module = modules.filter((module) =>
      user_module_name.includes(module.module_name),
    );
    const user_manager = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'USER'`,
      )
    )[0][0];

    for (const module of user_module) {
      roleSecurity.push({
        role_module_uuid: uuidv4(),
        module_uuid: module.module_uuid,
        role_uuid: user_manager.role_uuid,
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        bulk_import: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: JSON.stringify({ or: { user_uuid: ['*'] } }),
      });
    }
    // user
    const report_module_name = ['Report'];
    const report_module = modules.filter((module) =>
      report_module_name.includes(module.module_name),
    );
    const finance_manager = (
      await queryInterface.sequelize.query(
        `SELECT * FROM latest_roles WHERE role_value = 'FINANCE_MANAGER'`,
      )
    )[0][0];

    for (const module of report_module) {
      roleSecurity.push({
        role_module_uuid: uuidv4(),
        module_uuid: module.module_uuid,
        role_uuid: finance_manager.role_uuid,
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        bulk_import: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: JSON.stringify({ or: { user_uuid: ['*'] } }),
      });
    }

    await queryInterface.bulkInsert('role_module', roleSecurity);
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
