const { SERVICES_URL } = require('./microservices_url');
const { getData, throwError, responser } = require('./helperFunction');
const { getRecords } = require('./dbFunctions');
const moment = require('moment');

/**
 * Send Normal Email or email with template
 * @param {Array<string>} to Recipients emails
 * @param {string} subject Subject for email
 * @param {string} body Plain text or html
 * @param {string} template Template name for sending with email
 * @param {object} objectVariables it will be variables that used in the template
 * @param {Array<string>} cc CC emails
 * @param {Array<string>} bcc BCC emails
 * @param {{email?:string,name:string}} reply_to it will be variables that used in the template
 * @param {Array<{
 * content: bufferString,
 * filename: string
 * }>} attachments attachments for share files with emails
 * @returns {Promise}
 */
exports.sendEmailService = async (
  to,
  subject,
  body,
  template,
  objectVariables,
  cc,
  bcc,
  reply_to,
  attachments,
) => {
  return await getData(SERVICES_URL.sendEmail, null, 'json', {
    to,
    subject,
    body,
    template,
    objectVariables,
    cc,
    bcc,
    reply_to,
    attachments,
  });
};

/**
 * Generate PDF
 * @param {object} data
 * @param {string} template Name of the pdf template file
 * @param {{displayHeaderFooter:boolean,isTitlePage:boolean}} options other pdf options
 * @returns {Promise<Buffer>} Buffer format of the PDF file
 */
exports.pdfMaker = async (data = null, template, options) => {
  let pdfBufffer = await getData(SERVICES_URL.pdfGenerator, null, 'buffer', {
    data,
    template,
    options,
  });
  return pdfBufffer;
};

/**
 * Twilio service for whatsapp, sms and calls
 * @param {("whatsapp"|"sms"|"call")} type
 * @param {array<{to:string,name:"string"}>} data
 * @returns {Promise<0|1>}
 */

exports.twilio = async (type, data = null) => {
  try {
    const successArray = data.map((recipent) =>
      getData(
        type === 'whatsapp'
          ? SERVICES_URL.whatsapp
          : type === 'call'
            ? SERVICES_URL.call
            : SERVICES_URL.sms,
        null,
        'json',
        recipent,
      ),
    );
    Promise.all(successArray);
    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

exports.uploadService = async (data) => {
  let as_payload = data.as_payload;
  try {
    as_payload = JSON.parse(data.as_payload);
  } catch (_) {}
  let getfilePath = await getRecords(
    'attachments_structure',
    `where module_name= "${data.module_name}"`,
  );
  if (!getfilePath.length) return throwError(404, 'Module name is not valid');
  getfilePath = getfilePath[0].file_path;
  const pattern = /\${as_payload\.([^}]+)}/g;
  data.files = data.files.map((file) => {
    let splitName = file.name.split('.');
    as_payload.file_name = splitName[0];
    as_payload.file_ext = splitName[1];
    let match;
    while ((match = pattern.exec(getfilePath)) !== null) {
      const payloadKey = match[1];
      if (!as_payload.hasOwnProperty(payloadKey)) {
        return throwError(422, `'${payloadKey}' is need to be in as_payload`);
      }
    }
    file.path = eval('`' + getfilePath + '`');
    return file;
  });
  let fileNames = data.files.map((file) => file.path);
  await getData(
    SERVICES_URL.s3UploadFiles,
    null,
    'json',
    {
      fileNames,
      bufferArray: data.files.map((file) => file.data),
    },
    'POST',
  );
  return fileNames;
};
/**
 * Download File from S3
 * @param {array<string>} keys unique file or object name
 * @returns {Promise<Buffer>}
 */
exports.downloadFileS3 = async (keys) => {
  return await getData(SERVICES_URL.downloadFileS3, null, 'json', { keys });
};

exports.sendSmsService = async (data) => {
  return await getData(SERVICES_URL.sendSms, null, 'json', data, 'POST');
};
exports.sendWhatsAppService = async (data) => {
  return await getData(SERVICES_URL.sendWhatsapp, null, 'json', data, 'POST');
};
exports.voiceCallService = async (data) => {
  return await getData(SERVICES_URL.sendVoiceCall, null, 'json', data, 'POST');
};

exports.ejsPreview = async (data, templateName) => {
  let ejsText = await getData(SERVICES_URL.ejsPreview, null, 'text', {
    data,
    templateName,
  });
  return ejsText;
};

exports.generateTokenMicrosoftgraph = async (gen) => {
  console.log('Hitting microsoft genrate token function micro');
  return await getData(
    SERVICES_URL.microsoftGraphGenerateToken,
    null,
    'json',
    { gen },
    'POST',
  );
  // return token;
};

exports.getInboxMicrosoftgraph = async (email) => {
  console.log('data: ', email);

  let inbox = await getData(
    SERVICES_URL.microsoftGraphGetInbox,
    { email },
    'json',
    null,
    'GET',
  );
  return inbox;
};
exports.searchMicrosoftgraph = async (searchType, search, email) => {
  let searchSub = await getData(
    SERVICES_URL.microsoftGraphSearch,
    { searchType, search, email },
    'json',
    null,
    'GET',
  );
  return searchSub;
};

exports.sendEmailMicrosoftgraph = async (
  email,
  subject,
  body,
  toRecipients,
  ccRecipients,
  attachments,
) => {
  return await getData(SERVICES_URL.microsoftGraphSendEmail, null, 'json', {
    email,
    subject,
    body,
    toRecipients,
    ccRecipients,
    attachments,
  });
};
