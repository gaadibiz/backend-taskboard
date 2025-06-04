const express = require('express');
const router = express.Router();
const controller = require('./general.controller');
const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const Schema = require('./general.validation');
const checkAuth = require('../../middleware/checkAuth');
// Define your routes here
router
  .route('/send-grid-email')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.sendGridEmailBodySchema,
      controller.sendGridEmail,
    ),
  );
// Export the router

router
  .route('/get-signed-url')
  .get(
    requestErrorHandlingDecorator(
      Schema.getSignedUrlschema,
      controller.getSignedUrl,
    ),
  );

router
  .route('/upload-files')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(Schema.uploadFiles, controller.uploadFiles),
  );

router
  .route('/download-files')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.downloadFiles,
      controller.downloadFiles,
    ),
  );

router
  .route('/microsoftgraph/get-inbox')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.getInboxMicrosoftGraph),
  );

router
  .route('/microsoftgraph/search')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.searchMicrosoftGraph),
  );

router
  .route('/microsoftgraph/fetchUnreadEmails')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      null,
      controller.getMicrosoftGraphUnreadEmails,
    ),
  );

router
  .route('/microsoftgraph/send-email')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.sendEmailMicrosoftGraph),
  );

router
  .route('/base64-to-buffer')
  .post(
    requestErrorHandlingDecorator(
      Schema.base64ToBufferSchema,
      controller.covertBase64ToBuffer,
    ),
  );

router
  .route('/get-table-info')
  .get(checkAuth, requestErrorHandlingDecorator(null, controller.getTableInfo));

router
  .route('/get-table-description')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.getTableDescription),
  );
router
  .route('/upsert-documents')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertDocumentsSchema,
      controller.upsertDocuments,
    ),
  );

router
  .route('/get-documents')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getDocumentsSchema,
      controller.getDocuments,
    ),
  );

router
  .route('/get-record-counts')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.getRecordCount),
  );

router
  .route('/upsert-country-state')
  .post(
    requestErrorHandlingDecorator(
      Schema.upsertCountryStateSchema,
      controller.upsertCountryState,
    ),
  );

router
  .route('/get-country-state')
  .get(
    requestErrorHandlingDecorator(
      Schema.getCountryStateSchema,
      controller.getCountrySate,
    ),
  );

module.exports = router;
