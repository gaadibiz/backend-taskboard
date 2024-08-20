const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./report.controller');
const router = require('express').Router();
const Schema = require('./report.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert-expense')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertExpenseSchema,
      controller.upsertExpense,
    ),
  );

router
  .route('/get-expense')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getExpenseSchema,
      controller.getExpense,
    ),
  );

router
  .route('/upsert-report')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertReportSchema,
      controller.upsertReport,
    ),
  );

router
  .route('/get-report')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getReportSchema, controller.getReport),
  );

module.exports = router;
