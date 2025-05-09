const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./credit_debit_note.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./credit_debit_note.validation');

router
  .route('/upsert-credit-debit-note')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertCreditDebitNoteSchema,
      controller.upsertCreditDebitNote,
    ),
  );

router
  .route('/get-credit-debit-note')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getCreditDebitNoteSchema,
      controller.getCreditDebitNote,
    ),
  );

router
  .route('/upsert-debit-note')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertDebitNoteSchema,
      controller.upsertDebitNote,
    ),
  );

router
  .route('/get-debit-note')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getDebitNoteSchema,
      controller.getDebitNote,
    ),
  );

router
  .route('/get-credit-debit-note-preview')
  .get(
    requestErrorHandlingDecorator(
      Schema.getCDNPreviewSchema,
      controller.getCDNPreview,
    ),
  );

router
  .route('/get-debit-note-preview')
  .get(
    requestErrorHandlingDecorator(
      Schema.getDebitNotePreviewSchema,
      controller.getDebitNotePreview,
    ),
  );
module.exports = router;
