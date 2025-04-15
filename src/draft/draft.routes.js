const express = require('express');
const controller = require('./draft.controller');
const checkAuth = require('../../middleware/checkAuth');
const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const Schema = require('./draft.validation');

const router = express.Router();

router
  .route('/upsert-draft')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertDraftSchems,
      controller.upsertDraft,
    ),
  );
router
  .route('/delete-draft')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.deleteDraftSchema,
      controller.deleteDraft,
    ),
  );
router
  .route('/get-draft')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getDraftSchema, controller.getDraft),
  );

module.exports = router;
