const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./vendor.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./vendor.validation');

router
  .route('/upsert-vendor')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertVendorSchema,
      controller.upsertVendor,
    ),
  );

router
  .route('/get-vendor')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getVendorSchema, controller.getVendor),
  );

module.exports = router;
