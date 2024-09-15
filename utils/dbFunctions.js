const dbConfig = require('../config/database.config');
const Sequelize = require('sequelize');
const mysql = require('mysql2');
const {
  throwError,
  getData,
  deleteKeyValuePair,
  setDateTimeFormat,
  removeNullValueKey,
} = require('./helperFunction');
const { json } = require('body-parser');
const { object } = require('joi');

/**
 * Initiate instance of Squilize with database
 * @returns {Sequelize} instance of Squilize.
 */
exports.squilizeInit = () => {
  // create the connection to database
  return new Sequelize(
    dbConfig.development.database,
    dbConfig.development.username,
    dbConfig.development.password,
    {
      //  dialect: "mysql",
      dialect: dbConfig.development.dialect,
      host: dbConfig.development.host,
      logging: false,
      freezeTableName: true,
      dialectOptions: {
        multipleStatements: true,
      },
    },
  );
};

/**
 * Initiate instance of mysql2 with database.
 * @returns {mysql} Instance of mysql2
 */
const dbMysql = () => {
  // create the connection to database
  if (process.env.NODE_ENV === 'production') {
    return mysql.createConnection({
      host: dbConfig.production.host,
      user: dbConfig.production.username,
      password: dbConfig.production.password,
      database: dbConfig.production.database,
      multipleStatements: false,
    });
  } else {
    return mysql.createConnection({
      host: dbConfig.development.host,
      user: dbConfig.development.username,
      password: dbConfig.development.password,
      database: dbConfig.development.database,
      multipleStatements: false,
    });
  }
};

/**
 * Help to query on database.
 * @param {string} query
 * @param {array} any
 * @returns {Promise<[]>} result contains array of object data and errMsg will contain any error message.
 */
exports.dbRequest = async (query, any = []) => {
  let start = performance.now();
  let con = dbMysql();
  con.connect();
  let [result] = any.length
    ? await con
        .promise()
        .query(query, [any])
        .catch((err) => {
          console.log('DB error h:', err);
          throwError(404, err.sqlMessage);
        })
    : await con
        .promise()
        .query(query)
        .catch((err) => {
          console.log('DB error dk:', err);
          throwError(404, err.sqlMessage);
        });
  con.destroy();
  let end = performance.now();
  console.log('\n\n Query: ', query);
  console.log(`DB processing time: ${(end - start) / 1000} seconds\n\n`);
  return result;
};

/**
 * Get columns name from table
 * @param {string} tableName Name of the table.
 * @param {Array<number>} columnIndex Index number of column with base 0.
 * @param {{
 * isInsertTs:boolean,
 * isPrmiaryId:boolean,
 * columnsInArray:boolean
 * alias:string
 * }} options other options.
 * @returns {Promise<string>} Returns columns name in array of string.
 */
exports.getTableColumnsNames = async (
  tableName,
  columnName = [],
  options = {
    isInsertTs: false,
    isPrmiaryId: false,
    columnsInArray: false,
    alias: '',
  },
) => {
  if (columnName && columnName.length) return columnName?.toString();
  let result = await this.dbRequest(`DESCRIBE ${tableName};`);

  result = result?.map((ele) =>
    !options.columnsInArray
      ? (options.alias ? '`' + options.alias + '`.' : '') +
        '`' +
        ele.Field +
        '`'
      : ele.Field,
  );
  if (!tableName.startsWith('latest_') && !options.isInsertTs) result?.pop();
  if (!options.isPrmiaryId) result?.shift();
  if (options.columnsInArray) return result;
  return result?.toString();
};

/**
 * Returns total count number of records.
 * @param {string} table Table name.
 * @return {Promise<{result:Array<{totalRecords}>}>}.
 */
exports.getCountRecord = async (table, filter) => {
  return (
    await this.dbRequest(
      `select count(1) as totalRecords from ${table} ${filter};`,
    )
  )[0].totalRecords;
};

/**
 * Insert record by taking max id and set to primary id if not primary id.
 *
 * @param {string} table Table name.
 * @param  {string} primaryColumn  Primary column name.
 * @param {{string:any}} data Obejct key-value pair.
 * @return {Promise<{result,errMsg}>} Return object having result and errMsg key.
 */
exports.insertAndHandleNewMaxForPrimaryIdColumnService = async (
  table,
  primaryColumn,
  data,
) => {
  let id =
    (await dbRequest(`select max(${table}_id) as maxId FROM ${table}`))
      .result[0].maxId || 0;
  if (!data[primaryColumn]) data[primaryColumn] = id + 1;
  return await this.insertRecords(table, data);
};

/**
 * Fetch Records from given table or view.
 * @param {string} name Name of table or view.
 * @param {string|null} filter Filter SQL.
 * @param {string|null} pagination Pagination SQL.
 * @param {Array<string>|null} columnName Name of column to getselected columns records.
 * @param {{isInsertTs:boolean,isPrmiaryId,"isDistinct":boolean}} options other options.
 * @return {Promise<[]>} Return array of object in promise.
 */
exports.getRecords = async (
  name,
  filter,
  pagination,
  columnName = [],
  options,
) => {
  let columns = await this.getTableColumnsNames(name, columnName, options);
  let sql = `select ${
    options?.isDistinct ? 'DISTINCT' : ''
  } ${columns} from ${name} ${filter || ''} ${
    options?.isDistinct ? '' : pagination || ''
  };`;
  // console.log("Get SQL=", sql);
  return await this.dbRequest(sql);
};

exports.getFieldAndType = async (name) => {
  let obj = {};
  (await this.dbRequest(`DESCRIBE ${name};`)).forEach((ele) => {
    obj[ele.Field] = ele.Type;
  });
  return obj;
};

/**
 * Help to set params from request.
 * @param {Object} requestObject request object.
 * @param {string} tableName Table name.
 * @param {Array<number>} columnIndex Index number of column with base 0.
 * @param {{isInsertTs:boolean,isPrmiaryId}} options other options.
 * @returns {Promise<Array>} setted request data in form of Array of string.
 */
exports.parseRequestParams = async (
  requestObject,
  tableName,
  columnIndex = [],
  options = { isInsertTs: false, isPrmiaryId: false },
) => {
  if (Array.isArray(requestObject)) {
    for (let index = 0; index < requestObject.length; index++) {
      requestObject[index] = await this.parseRequestParams(
        requestObject[index],
        tableName,
      );
    }
    return requestObject;
  } else {
    let columns = `${(
      await this.getTableColumnsNames(tableName, columnIndex, options)
    ).toString()}`;
    let columnTypes = await this.getFieldAndType(tableName);
    let arrayData = columns.split(',').map((column) => {
      column = column.replace(/`/g, '');
      if (column === 'status' && !requestObject[column])
        requestObject[column] = 'ACTIVE';
      if (
        // (Array.isArray(requestObject[column]) ||
        //   typeof requestObject[column] === 'object') &&
        columnTypes[column] === 'json' &&
        requestObject[column] !== null
      ) {
        requestObject[column] = JSON.stringify(requestObject[column]);
      }
      if (
        (columnTypes[column] === 'datetime' ||
          columnTypes[column] === 'timestamp') &&
        requestObject[column] !== null
      ) {
        requestObject[column] = setDateTimeFormat(
          'timestemp',
          requestObject[column],
        );
      }
      return requestObject[column] === null ? null : requestObject[column];
    });
    // console.log("requestObject=",requestObject)
    return arrayData;
  }
};

/**
 * Insert Records from given table or view.
 * @param {string} name Name of table or view.
 * @param {{string:any} | [{string:any}]} data Object key-value pair or array of object.
 * @param {Array<number>} columnIndex Index number of column with base 0.
 * @param {{isInsertTs:boolean,isPrmiaryId}} options other options.
 * @return {Promise<void>} void.
 */
exports.insertRecords = async (name, data, columnIndex, options) => {
  let formValue = await this.parseRequestParams(
    Array.isArray(data) ? [...data] : JSON.parse(JSON.stringify(data)),
    name,
    columnIndex,
    options,
  );
  let columns = await this.getTableColumnsNames(name, null, options);
  if (formValue.every((ele) => ele && ele.constructor === Array)) {
    return await this.dbRequest(
      `INSERT INTO ${name} (${columns.toString()}) VALUES ?`,
      formValue,
    );
  }
  return await this.dbRequest(
    `INSERT INTO ${name} (${columns.toString()}) VALUES ?`,
    [formValue],
  );
};

/**
 * Check whether record is exist or not.
 * @param {string} name Name of the table.
 * @param {Array<string>} columnName Name of the column in which you are tring to search record.
 * @param {Array<string>} value Value which is need to be search.
 * @returns {Promise<number>}
 */
exports.isRecordExist = async (name, columnName, value) => {
  let promiseResp = columnName.map((cl, index) =>
    this.dbRequest(
      `SELECT IF(COUNT(${cl}),COUNT(${cl}),0) AS isExist FROM ${name} WHERE ${cl}='${value[index]}'`,
    ),
  );
  let resultant = await Promise.all(promiseResp);
  console.log(resultant);
  // resultant = resultant.map((obj) => obj.result);
  return resultant.some((ele) => ele[0].isExist === 1);
};

/**
 * Insert Records from given table or view.
 * @param {string} table Name of table or view.
 * @param {string} incrementalColumnName Name of the incremental column.
 * @param {string} linkageColumnName Name of the linked column.
 * @param {{string:any}| [{string:any}] } data Data object.
 * @param {{isInsertTs:boolean,isPrmiaryId}} options other options.
 * @return {Promise<void>} void.
 */
exports.insertRecordHandleIncremental = async (
  table,
  incrementalColumnName,
  linkageColumnName,
  data,
  options,
) => {
  if (
    data[incrementalColumnName] === 0 ||
    data[incrementalColumnName] === null ||
    data[incrementalColumnName] === undefined
  ) {
    let maxValue =
      (
        await this.dbRequest(
          `select max(${incrementalColumnName}) as maximmumValue FROM ${table} where ${linkageColumnName}='${data[linkageColumnName]}'`,
        )
      )[0].maximmumValue || 0;
    data[incrementalColumnName] = parseInt(maxValue) + 1;
  } else {
    let isValid = (
      await this.dbRequest(
        `select count(${incrementalColumnName}) as isValid from ${table} where  ${linkageColumnName}='${data[linkageColumnName]}' and ${incrementalColumnName}='${data[incrementalColumnName]}'`,
      )
    )[0].isValid;
    if (!isValid) {
      let maxValue =
        (
          await this.dbRequest(
            `select max(${incrementalColumnName}) as maximmumValue FROM ${table} where ${linkageColumnName}='${data[linkageColumnName]}'`,
          )
        )[0].maximmumValue || 0;
      data[incrementalColumnName] = parseInt(maxValue) + 1;
    }
  }
  return await this.insertRecords(table, data, null, options);
};

exports.likeFilterSqlQuery = (columns = [], value = '') => {
  let likeSql = '';
  if (!!value && columns.length) {
    likeSql = columns.toString();
    likeSql =
      likeSql.replace(/,/g, ` like '%${value}%' OR `) + ` like '%${value}%'`;
  }
  return '(' + likeSql + ')';
};

exports.filterFunctionality = (
  idSearch,
  status,
  to_date,
  from_date,
  columns = [],
  value = '',
  options = {
    alias: '',
  },
) => {
  const aliases = options.alias ? options.alias + '.' : '';
  if (
    columns.length > 0 &&
    columns[0] &&
    (columns[0].trim().startsWith(',') ||
      columns[0].trim().endsWith(',') ||
      columns[0].trim().includes(',,') ||
      columns[0].trim().includes('null'))
  ) {
    throwError(404, 'Element in the columns cannot be empty or null.');
  }

  if (columns.length > 0 && columns[0] == '') {
    throwError(404, 'Element in the columns cannot be empty .');
  }

  if (value !== '' && columns[0] === undefined) {
    console.log('valueis empty ', value);
    throwError(404, 'Both columns and value are required for search.');
  }

  if (value == '' && columns[0] !== '' && columns[0] !== undefined) {
    console.log('valueis empty ', value);
    throwError(404, 'Both columns and value are required for search.');
  }

  let obj = { idSearch, to_date, from_date };
  if (from_date) obj.from_date = obj.from_date + ' 00:00:00';
  if (to_date) obj.to_date = obj.to_date + ' 23:59:59';
  obj[`${aliases}status`] = status;

  // Deleting null key-value
  Object.keys(obj).forEach((key, index) => {
    if (key === 'idSearch') {
      Object.keys(idSearch).forEach((key) => {
        if (!idSearch[key]) delete idSearch[key];
      });
    }
    if (
      !obj[key] ||
      (typeof obj[key] === 'object' && !Object.keys(obj[key]).length)
    ) {
      delete obj[key];
    }
  });
  let keyObj = Object.keys(obj);
  let subSql = '';
  // If any variable has data
  if (Object.keys(obj).length || (!!value && columns.length)) subSql = 'WHERE ';

  keyObj.forEach((key, index) => {
    if (obj[key]) {
      if (typeof obj[key] === 'object') {
        let keyIdSearch = Object.keys(obj[key]);
        keyIdSearch.forEach((idKey, i) => {
          subSql += idKey + '=' + `'${idSearch[idKey]}'`;
          if (keyIdSearch.length - 1 !== i) subSql += ' AND ';
        });
        if (keyObj.length - 1 !== index) subSql += ' AND ';
      } else {
        subSql += key + '=' + `'${obj[key]}'`;
        if (keyObj.length - 1 !== index) subSql += ' AND ';
      }
    }
  });
  subSql = subSql.replace('from_date=', `${aliases}insert_ts>=`);
  subSql = subSql.replace('to_date=', `${aliases}insert_ts<=`);
  // Apply like filter
  if (!!value && columns.length) {
    if (subSql.length && subSql !== 'WHERE ') subSql += ' AND ';
    subSql += ' ' + this.likeFilterSqlQuery(columns, value);
  }
  return subSql;
};

/**
 * Return SQL of pagination and in decreasing order.
 * @param {number} pageNo Page number.
 * @param {number} itemPerPage Item per page.
 * @returns {string} String of SQL.
 */
exports.pagination = (pageNo, itemPerPage, options = { alias: '' }) => {
  const aliases = options.alias ? options.alias + '.' : '';
  return `ORDER BY ${aliases}insert_ts DESC ${
    pageNo && itemPerPage
      ? `limit ${(pageNo - 1) * itemPerPage},${itemPerPage}`
      : ' limit 0,100'
  };`;
};

exports.dataStringForSQL = (formValue = []) => {
  formValue = formValue.map((item) => item || 'null');
  let modifiedString = formValue.map((item) => "'" + item + "'").toString();
  if (modifiedString.includes('{') && modifiedString.includes('}')) {
    let start = modifiedString.indexOf('{');
    let end = modifiedString.indexOf('}');
    let newString = '';
    for (let i = start; i <= end; i++) {
      if (modifiedString[i] !== "'") newString += modifiedString[i];
    }
    modifiedString = modifiedString.replace(
      modifiedString.slice(start, end + 1),
      newString,
    );
  }
  return modifiedString.replace(/'null'/g, 'NULL');
};

exports.otpHandler = async (user_fact_id, otp_for, otp) => {
  return (
    await this.dbRequest(
      `call otp_handler('${user_fact_id}',${
        otp ? `'${otp}'` : 'NULL'
      },'${otp_for}')`,
    )
  )[0][0].value;
};

/**
 * Update record in table
 * @param {string} table Table name
 * @param {{}} data Key value pair.
 * @param {{}} condition Key value pair
 * @returns {Promise<void>}
 */
exports.updateRecord = async (table, data, condition) => {
  let setPayload = Object.keys(data)
    .map((key) => `${key}='${data[key]}'`)
    .join(', ');
  let wherePayload = Object.keys(condition)
    .map((key) => `${key}='${condition[key]}'`)
    .join(' AND ');
  let sql = `UPDATE ${table} SET ${setPayload} WHERE ${wherePayload}`;
  await this.dbRequest(sql);
};

/**
 * Delete record from table
 * @param {string} table Table name
 * @param {{}} condition Key value pair
 * @returns {Promise<void>}
 */
exports.isValidRecord = async (table, condition) => {
  let wherePayload = Object.keys(condition)
    .map((key) => `${key}='${condition[key]}'`)
    .join(' AND ');
  let sql = `SELECT COUNT(1) as isValid FROM ${table} WHERE ${wherePayload}`;
  return (await this.dbRequest(sql))[0].isValid;
};

exports.roleFilterService = async (
  filterSql,
  tableName,
  selfUser,
  options = { alias: '' },
) => {
  if (
    !process.env.ROLE_FILTER ||
    process.env.ROLE_FILTER === 'false' ||
    !selfUser.ROLE_FILTER === false
  )
    return filterSql;
  let roleFiletrData = (
    await this.dbRequest(
      `call role_content_access('${selfUser.role_uuid}',"${tableName}")`,
    )
  )[0];
  if (!roleFiletrData.length)
    throwError(403, 'No module access for this Role!');
  if (
    !roleFiletrData[0].view_access ||
    roleFiletrData[0].status !== 'ACTIVE' ||
    (roleFiletrData[0].module_name !== 'Approval' &&
      !Object.keys(roleFiletrData[0].filter_values).length)
  )
    throwError(403, 'You have no access to see this module content!');
  let initJsonValue = roleFiletrData[0].filter_values;
  let andOr = initJsonValue.hasOwnProperty('and')
    ? 'and'
    : initJsonValue.hasOwnProperty('or')
      ? 'or'
      : '';
  let jsonValue = andOr ? initJsonValue[andOr] : initJsonValue;
  if (jsonValue.hasOwnProperty('branch_uuid')) {
    let branchOfZone = selfUser['branch_uuid'];
    if (jsonValue['branch_uuid'].includes('self_zone')) {
      let dataOfZone = (
        await this.getRecords(
          'latest_zone',
          `WHERE JSON_CONTAINS(branches_uuid, '{"branch_uuid": "${branchOfZone}"}') > 0`,
        )
      )[0];
      dataOfZone.branches_uuid.forEach((branch) => {
        jsonValue.branch_uuid.push(branch.branch_uuid);
      });
      // Find the index of 'self_zone' in the branch_uuid array
      let indexToRemove = jsonValue.branch_uuid.indexOf('self_zone');

      // Remove 'self_zone'
      if (indexToRemove !== -1) {
        jsonValue.branch_uuid.splice(indexToRemove, 1);
      }
    }
  }

  let keys = Object.keys(jsonValue);
  let roleFiletrQuery = '';
  keys.forEach((key) => {
    let subQuery = '';
    if (Array.isArray(jsonValue[key]) && !jsonValue[key].includes('*')) {
      subQuery =
        '(' +
        jsonValue[key]
          .map((ele) => `${key}="${selfUser[ele] || ele}"`)
          .join(' or ') +
        ')';
    }
    if (roleFiletrQuery && subQuery) {
      roleFiletrQuery = roleFiletrQuery + ' ' + andOr + ' ' + subQuery;
    } else if (subQuery) roleFiletrQuery += subQuery;
  });
  if (roleFiletrQuery) {
    if (!Array.isArray(roleFiletrData[0].map_column_user_uuid))
      throwError(400, 'Invalid map_column_user_uuid as array!');
    let mapColumnIdQuery = roleFiletrData[0].map_column_user_uuid
      .map(
        (ele) =>
          `${
            options.alias + ele
          } IN ( select user_uuid from latest_user where ${roleFiletrQuery} )`,
      )
      .join(' OR ');
    filterSql = filterSql
      ? filterSql + ' AND ( ' + mapColumnIdQuery + ' )'
      : 'WHERE ' + mapColumnIdQuery;
  }
  console.log('\n\nrole Filter:', filterSql, '\n\n');
  return filterSql;
};

exports.isEditAccess = async (tableName, selfUser) => {
  if (!process.env.ROLE_FILTER || process.env.ROLE_FILTER === 'false')
    return true;
  let roleFiletrData = (
    await this.dbRequest(
      `call role_content_access('${selfUser.role_uuid}',"${tableName}")`,
    )
  )[0];
  if (!roleFiletrData.length)
    throwError(403, 'No module access for this Role!');
  if (
    !roleFiletrData[0].view_access ||
    !roleFiletrData[0].edit_access ||
    roleFiletrData[0].status !== 'ACTIVE'
  )
    throwError(403, 'You have no access to Edit this module!');
};

/**
 * Count occurrences of different types in a column
 * @param {string} table Table name
 * @param {string} column Column name
 * @returns {Promise<Array<{type: string, count: number}>>}
 */
exports.countTypesInColumn = async (table, column, filter) => {
  let sql = `
    SELECT ${column}, COUNT(*) AS count
    FROM ${table} ${filter}
    GROUP BY ${column};
  `;
  return await this.dbRequest(sql);
};

/**
 * Insert on updated record using previous record history.
 * @param {string} name Table name
 * @param {object} data Current Data.
 * @param {string} whereCondition Simple Where query e.g where user_id=1
 * @param {Array<string>} columnName Columns name of the given table or view.
 *  @param {{
 * isInsertTs:boolean,
 * isPrmiaryId:boolean,
 * columnsInArray:boolean,
 * alias:string,
 * otherViewName: string
 * }} options other options.
 * @returns
 */
exports.upsertRecords = async (
  name,
  data,
  whereCondition,
  columnName,
  options,
) => {
  removeNullValueKey(data);
  let columns = await this.getTableColumnsNames(name, columnName, options);
  columns = columns
    .split(',')
    .map((ele) =>
      data[ele.replace(/`/g, '')]
        ? `'${data[ele.replace(/`/g, '')]}' as ${ele}`
        : ele,
    );
  let sql = `INSERT INTO ${name} (${await this.getTableColumnsNames(
    name,
  )}) (select ${columns} from ${
    options.otherViewName || `latest_${name}`
  } ${whereCondition} )`;
  // console.log(sql)
  return await this.dbRequest(sql);
};

exports.listOrderBy = (filter, value, desc = true) => {
  return (
    filter + ` order by ${value ? value : 'insert_ts'} ${desc ? 'DESC' : 'ASC'}`
  );
};
