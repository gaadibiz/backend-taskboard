require('dotenv').config();
const Sequelize = require('sequelize');
const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_DIALECT } = process.env;
module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: DB_DIALECT,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: DB_DIALECT,
  },
};

exports.dbMysql = () => {
  // create the connection to database
  return new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT,
    host: DB_HOST,
    logging: false,
    freezeTableName: true,
    // dialectOptions: {
    //   multipleStatements: true
    // }
  });
};
