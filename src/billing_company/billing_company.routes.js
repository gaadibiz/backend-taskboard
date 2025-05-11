const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./billing_company.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./billing_company.validation');

router
  .route('/upsert-billing-company')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertBillingCompanySchema,
      controller.upsertBillingCompany,
    ),
  );

router
  .route('/get-billing-company')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getBillingCompanySchema,
      controller.getBillingCompany,
    ),
  );

module.exports = router;
