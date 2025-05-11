'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      product_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      item_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hsn_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      product_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gst: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cess: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cess_amount: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      no_itc: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category_uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sell_price: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sell_price_tax: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      purchase_price: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      purchase_price_tax: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      colour: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT, //Using TEXT for longer data
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};
