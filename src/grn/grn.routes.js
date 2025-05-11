const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./grn.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./grn.validation');

router
  .route('/upsert-grn')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(Schema.upsertGRNSchema, controller.upsertGRN),
  );

router
  .route('/get-grn')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getGRNSchema, controller.getGRN),
  );
module.exports = router;
