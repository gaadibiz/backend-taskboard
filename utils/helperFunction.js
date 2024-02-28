const fetch = require('cross-fetch');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { asIs } = require('sequelize');
const { ToWords } = require('to-words');
require('dotenv').config();

exports.throwError = (status, message) => {
  throw new Error(JSON.stringify({ status, message }));
};

/**
 * Return object reponse.
 * @param {string} msg Any message.
 * @param {array} data Data will be send in array of object.
 * @param {number} currentCountRecord Current records comes from DB service.
 * @param {number} totalCountRecord Total records comes from DB service.
 * @param {string} metaData Any meta data.
 * @returns {Promise<array>} array of object.
 */
exports.responser = (
  msg,
  data,
  currentCountRecord,
  totalCountRecord,
  metaData,
) => {
  return {
    message: msg || undefined,
    totalRecords: totalCountRecord, // count of total record for pagination
    currentRecords: currentCountRecord, // count of current sending record for pagination
    data: data || undefined,
    meta: metaData || undefined,
  };
};

/**
 * Request API
 * @param {string} url
 * @param {object} params
 * @param {("json"|"text"|"buffer"|"html")} response_type
 * @param {object} bodyData
 * @param {("GET"|"POST"|"PUT"|"DELETE")} method
 * @param {object} header
 * @returns
 */
exports.getData = async (
  url,
  params = null,
  response_type = 'json',
  bodyData = null,
  method = 'POST',
  header = null,
) => {
  let Url = new URL(url);
  for (let k in params) {
    Url.searchParams.append(k, params[k]);
  }
  console.log('hitting url:', url);
  let req = await fetch(bodyData ? url : Url, {
    method: bodyData ? method : 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...header,
    },
    [bodyData ? 'body' : null]: JSON.stringify(bodyData),
  });
  let res = undefined;
  if (response_type === 'json') res = await req.json();
  if (response_type === 'text') res = await req.text();
  if (response_type === 'buffer') res = await req.arrayBuffer();
  if (response_type === 'html') res = await req.html();
  if (req.status >= 400) {
    throw new Error(
      JSON.stringify({ status: req.status, message: res?.message }),
    );
  }
  return res;
};

/**
 * Give All the files within Directory.
 * @param {string} endPath Path of the file from base directory.
 * @param {string} msg Any message you want to show.
 * @returns {Promise<Array<string>>} Array of string.
 */
exports.readDirectory = async (endPath, msg = null) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, `/../${endPath}`), async (err, files) => {
      if (msg) console.log('\n\n', colors.yellow.bold(msg));
      if (err) {
        console.log('Unable to scan directory: ' + err);
        return reject(0);
      }
      //listing all files using forEach
      return resolve(files);
    });
  });
};

/**
 * Read All content form the file.
 * @param {string} endPath Path of the file from base directory.
 * @param {string} fileName Name of the file.
 * @param {string} msg Any message you want to show.
 * @returns {Promise<string|number>} Array of string.
 */
exports.readFileContent = async (endPath, fileName, msg = undefined) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, `/../${endPath}/${fileName}`),
      'utf-8',
      async (err, file) => {
        if (msg) console.log('\n\n', colors.yellow.bold(msg));
        if (err) {
          console.log('Unable to scan directory: ' + err);
          return reject(0);
        }
        //listing all files using forEach
        return resolve(file.toLocaleString());
      },
    );
  });
};

/**
 * Return datetime or timestemp format.
 * @param {"datetime"|"timestemp"} type Type will be datetime or timestemp.
 * @param {Date} dateTime Datetime will be in iso stream.
 * @returns {string} String format of datetime.
 */
exports.setDateTimeFormat = (type, dateTime) => {
  switch (type) {
    case 'datetime':
      return moment(dateTime).format('YYYY-MM-DD HH-mm-ss');
    case 'timestemp':
      return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
    case 'customtime':
      return moment(customtime).format('YYYY-MM-DD HH:mm:ss');
  }
};

async function validateFunc(schemaName, dataToValidate) {
  try {
    const value = await schemaName.validateAsync(dataToValidate);
    return { value };
  } catch (error) {
    console.log('error in schema', error);
    error = { status: 406, message: error.details[0].message };
    throw error;
  }
}

exports.requestErrorHandlingDecorator = (validatorSchema, handler) => {
  return async (req, res, next) => {
    let start = performance.now();
    try {
      let body = req?.body;
      if (validatorSchema) {
        let value = await validateFunc(
          validatorSchema,
          Object.keys(body).length ? req.body : req.query,
        );
        if (body) {
          if (Array.isArray(value.value)) {
            req.body = value.value.map((item) => {
              return {
                ...item,
                created_by_uuid: req.user.user_uuid, // handle create_by_id for every table
              };
            });
          } else req.body = { ...value.value };
        } else req.query = { ...value.value };
      }
      await handler(req, res);
      let end = performance.now();
      console.log(`Processing time: ${(end - start) / 1000} seconds`);
    } catch (error) {
      console.log('Error catch by decorator:', error);
      try {
        error = JSON.parse(error.message);
      } catch (e) {}
      let end = performance.now();
      console.log(`Processing time: ${(end - start) / 1000} seconds`);
      return res
        .status(parseInt(error.status) || 500)
        .json(this.responser(error.message));
    }
  };
};

/**
 * Generate Unique Code
 * @param {{
 * length:number,
 * numOnly:boolean
 * }} options
 * @returns {string} Unique code of string.
 */

exports.generateCode = (options = { length: 6, numOnly: false }) => {
  const { length, numOnly } = options;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    if (numOnly) {
      randomCode += Math.floor(Math.random() * 10);
    } else {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
      randomCode = randomCode.toUpperCase();
    }
  }

  return randomCode;
};

exports.removeNullValueKey = (data) => {
  for (let key in data) {
    if (data[key] === null) delete data[key];
  }
};

exports.deleteKeyValuePair = (payload, deleteKey = []) => {
  if (Array.isArray(payload)) {
    payload.forEach((obj) => {
      deleteKey.forEach((key) => {
        delete obj[key];
      });
    });
  } else
    deleteKey.forEach((key) => {
      delete payload[key];
    });
};

/**
 * Convert number to currency
 * @param {number} value number value
 * @param {{
 * localeCode: ("en-US"|"en-IN"),
 * currency:("INR"|"USD")
 * }} options Default localeCode and currency is set to Indian standard.
 * @returns
 */
exports.numberToCurrency = (value, options) => {
  let formatter = new Intl.NumberFormat(options?.localeCode || 'en-IN', {
    currency: options.currency || 'INR',
    style: 'currency',
  });
  return formatter.format(value);
};

/**
 * Convert Currency to words
 * @param {number} currency
 * @param {{
 * localeCode:("en-IN"|"en-US")}} options
 * @returns
 */
exports.currencyToWords = (currency, options) => {
  let toWords = new ToWords({ localeCode: options.localeCode });
  return toWords.convert(currency, { currency: true });
};
