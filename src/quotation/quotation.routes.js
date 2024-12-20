const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./quotation.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./quotation.validation');

router
  .route('/upsert-quotation')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertQuotationSchema,
      controller.upsertQuotation,
    ),
  );

router
  .route('/get-quotation')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getQuotationSchema,
      controller.getQuotation,
    ),
  );
module.exports = router;
