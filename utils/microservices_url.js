require('dotenv').config();
const serverUrl = process.env.MICRO_SERVICE_URL + process.env.PRIFIX_URL;
exports.SERVICES_URL = {
  serverUrl,
  // pdfGenerator: serverUrl + process.env.PDF_GENERATOR,
  pdfGenerator: serverUrl + '/pdf/generate-pdf',
  whatsapp: serverUrl + process.env.TWILIO_WHATSAPP,
  sms: serverUrl + process.env.TWILIO_SMS,
  call: serverUrl + process.env.TWILIO_CALL,
  s3UploadFiles: serverUrl + '/s3/upload-files',
  downloadFileS3: serverUrl + '/s3/download-multiple-files',
  sendAttachmentsEmailSendgrid:
    serverUrl + process.env.SEND_ATTACHMENTS_WITH_EMAIL_SENDGRID,
  companyEmail: serverUrl + process.env.FROM_VERIFIED_EMAIL,
  sendEmail: serverUrl + '/sendgrid/send-email',
  sendSms: serverUrl + process.env.SEND_SMS,
  sendWhatsapp: serverUrl + process.env.SEND_WHATSAPP,
  sendVoiceCall: serverUrl + process.env.SEND_VOICE_CALL,
  ejsPreview: serverUrl + '/ejs/preview-ejs',
  uploadOnS3: serverUrl + '/s3/upload-files',
  getSignedUrl: serverUrl + '/s3/get-signed-url',
  microsoftGraphGenerateToken: serverUrl + '/microsoftgraph/generate-token',
  microsoftGraphGetInbox: serverUrl + '/microsoftgraph/get-inbox',
  microsoftGraphSearch: serverUrl + '/microsoftgraph/search',
  microsoftGraphSendEmail: serverUrl + '/microsoftgraph/send-email',
};
