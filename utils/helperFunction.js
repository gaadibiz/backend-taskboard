const fetch = require('cross-fetch');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { asIs } = require('sequelize');
const { ToWords } = require('to-words');
require('dotenv').config();
const { Readable } = require('stream');
const FormData = require('form-data');
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
 * Sends a request to the specified API endpoint.
 * @param {string} url - The URL of the API endpoint.
 * @param {Array<string>|object} paramOrQuery - eg. param ["<uuid>","<id>"] or query {<key>:<value>}.
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method - The HTTP method to be used for the request.
 * @param {{
 * "Content-Type":"application/json"|"multipart/form-data"
 * }} headers - The default header is application/json.
 * @param {object|Array<{files:{name:string,data:Buffer}[],options}>} body - The body of the request.
 * @return {object} The response from the API endpoint.
 */
exports.requestApi = async (url, paramOrQuery, method, headers, body) => {
  let requestPayload = {
    method: method || 'GET',
    headers: null,
  };
  if (!headers) headers = {};
  let Url = new URL(url);
  if (typeof paramOrQuery === 'object') {
    if (Array.isArray(paramOrQuery)) {
      for (let k of paramOrQuery) {
        Url.pathname += '/' + k;
      }
    } else {
      for (let k in paramOrQuery) {
        Url.searchParams.append(k, paramOrQuery[k]);
      }
    }
  } else if (paramOrQuery) {
    this.throwError(400, 'paramOrQuery must be an Array of string or object.');
  }
  if (headers['Content-Type'] == 'multipart/form-data') {
    console.log(body);
    const form = new FormData();

    console.log(Object.keys(body));
    Object.keys(body).forEach((key) => {
      if (body[key]) {
        if (key === 'files') {
          // Handle files separately
          body.files.forEach((file) => {
            const stream = Readable.from(file.data);
            form.append('files', stream, {
              filename: file.name,
            });
          });
        } else {
          // Append other properties to the form
          form.append(key, body[key]);
        }
      }
    });

    requestPayload.headers = { ...form.getHeaders(), ...headers };
    requestPayload.body = form;
  } else {
    requestPayload.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      ...headers,
    };
    requestPayload.body = JSON.stringify(body);
  }
  this.deleteKeyValuePair(requestPayload.headers, ['content-length']);
  console.group('Request API');
  console.log('url:', Url.href);
  console.log('method:', method);
  console.log('headers:', requestPayload.headers);
  console.log('body:', requestPayload.body);
  console.groupEnd('Request API');
  // let req = await fetch(SERVICES_URL.streamUploading, requestPayload);
  let req = await fetch(Url.href, requestPayload);
  let res = undefined;
  switch (req.headers.get('content-type').split(';')[0]) {
    case 'application/json':
      res = await req.json();
      break;
    case 'text/html':
      res = await req.text();
      break;
    case 'text/plain':
      res = await req.text();
      break;
    case 'application/pdf':
      res = await req.arrayBuffer();
      break;
  }
  if (req.status >= 400) {
    throw new Error(
      JSON.stringify({ status: req.status, message: res.message }),
    );
  }
  return res;
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
exports.apiRequest = async (
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
  console.log('req', req);
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

exports.incrementStringWithReset = (currentString) => {
  // Convert string to a number
  let currentNumber = parseInt(currentString);
  currentNumber =
    currentNumber === 0 || currentNumber === undefined ? 0 : currentNumber;

  // Increment the number
  let nextNumber = currentNumber + 1;

  // Convert the result back to a string
  return nextNumber.toString();
};

exports.convertISOToDate = (isoString) => {
  // Create a new Date object from the ISO string
  const date = new Date(isoString);

  // Extract the year, month, and day as local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  // Format the date as dd-mm-yyyy
  return `${year}-${month}-${day}`;
};

exports.convertIsoUTCToLocalDate = (isoString) => {
  // Create a new Date object from the ISO string
  const date = new Date(isoString);

  // Convert to UTC+5:30
  const offset = 5.5 * 60; // Offset in minutes
  const localDate = new Date(date.getTime() + offset * 60000);

  // Extract the year, month, and day as local date components
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(localDate.getDate()).padStart(2, '0');

  // Format the date as YYYY-MM-DD
  return `${year}-${month}-${day}`;
};

function aggregateData({
  data,
  tableName = 'default_table',
  uniqueField,
  aggregateField,
  newAggregateFieldName = 'aggregated_field',
}) {
  if (!uniqueField || !aggregateField) {
    throw new Error(
      `[${tableName}] Missing required parameters: uniqueField and aggregateField.`,
    );
  }

  const aggregated = {};

  data.forEach((item) => {
    const uniqueKey = item[uniqueField];
    const aggregateValue = item[aggregateField];
    const rest = { ...item };
    delete rest[aggregateField];

    if (!aggregated[uniqueKey]) {
      aggregated[uniqueKey] = { ...rest, [newAggregateFieldName]: [] };
    }

    if (aggregateValue) {
      aggregated[uniqueKey][newAggregateFieldName].push(aggregateValue);
    }
  });

  return Object.values(aggregated);
}

exports.convertAmountToWords = (amount) => {
  // Single digit and teen numbers
  const words = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  // Tens multiples
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  if (amount < 20) {
    return words[amount];
  }

  if (amount < 100) {
    return (
      tens[Math.floor(amount / 10)] +
      (amount % 10 !== 0 ? ' ' + words[amount % 10] : '')
    );
  }

  if (amount < 1000) {
    return (
      words[Math.floor(amount / 100)] +
      ' Hundred' +
      (amount % 100 !== 0
        ? ' and ' + this.convertAmountToWords(amount % 100)
        : '')
    );
  }

  if (amount < 1000000) {
    return (
      this.convertAmountToWords(Math.floor(amount / 1000)) +
      ' Thousand' +
      (amount % 1000 !== 0
        ? ' ' + this.convertAmountToWords(amount % 1000)
        : '')
    );
  }

  if (amount < 1000000000) {
    return (
      this.convertAmountToWords(Math.floor(amount / 1000000)) +
      ' Million' +
      (amount % 1000000 !== 0
        ? ' ' + this.convertAmountToWords(amount % 1000000)
        : '')
    );
  }

  return 'Amount out of range';
};

//Same as above but with Indian Style(lakh, crore)
exports.convertAmountToIndianStyleWords = (amount) => {
  // Single digit and teen numbers
  const words = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  // Tens multiples
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  if (amount < 20) {
    return words[amount];
  }

  if (amount < 100) {
    return (
      tens[Math.floor(amount / 10)] +
      (amount % 10 !== 0 ? ' ' + words[amount % 10] : '')
    );
  }

  if (amount < 1000) {
    return (
      words[Math.floor(amount / 100)] +
      ' Hundred' +
      (amount % 100 !== 0
        ? ' and ' + this.convertAmountToWords(amount % 100)
        : '')
    );
  }

  if (amount < 100000) {
    return (
      this.convertAmountToWords(Math.floor(amount / 1000)) +
      ' Thousand' +
      (amount % 1000 !== 0
        ? ' ' + this.convertAmountToWords(amount % 1000)
        : '')
    );
  }

  if (amount < 10000000) {
    return (
      this.convertAmountToWords(Math.floor(amount / 100000)) +
      ' Lakh' +
      (amount % 100000 !== 0
        ? ' ' + this.convertAmountToWords(amount % 100000)
        : '')
    );
  }

  if (amount < 1000000000) {
    return (
      this.convertAmountToWords(Math.floor(amount / 10000000)) +
      ' Crore' +
      (amount % 10000000 !== 0
        ? ' ' + this.convertAmountToWords(amount % 10000000)
        : '')
    );
  }

  return 'Amount out of range';
};

/**
 * Return object reponse.
 * @param {number} number Any number
 * @returns {The same number edited in Indian Number System Style} String.
 */
exports.formatIndianStyle = (number) => {
  let parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{2})+\d{1}(?!\d))/g, ',');
  return parts.join('.');
};

/**
 * Return object reponse.
 * @param {number} number Any number
 * @returns {The same number edited in International Number System Style} String.
 */
exports.formatInternationalStyle = (number) => {
  const formattedAmount = number.toLocaleString('en-US');
  return formattedAmount;
};

exports.compareObjects = (obj1, obj2) => {
  let changes = {};
  function isEqual(value1, value2) {
    if (Array.isArray(value1) && Array.isArray(value2)) {
      // Compare arrays by converting them to strings or use a deep equality check
      return (
        value1.length === value2.length &&
        value1.every((item, index) => item === value2[index])
      );
    }
    if (!value1 && !value2) return true;
    return value1 === value2;
  }
  // Combine keys from both objects to ensure all keys are checked
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  allKeys.forEach((key) => {
    if (!isEqual(obj1[key], obj2[key])) {
      changes[key] = {
        old_value: obj1[key],
        new_value: obj2[key],
      };
    }
  });
  return changes;
};
