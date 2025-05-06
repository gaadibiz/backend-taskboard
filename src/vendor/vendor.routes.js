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

router
  .route('/upsert-vendor-expense')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertVendorExpenseSchema,
      controller.upsertVendorExpense,
    ),
  );

router
  .route('/get-vendor-expense')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getvendorExpenseSchema,
      controller.getVendorExpense,
    ),
  );

router
  .route('/upsert-vendor-expense-category')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertVendorExpenseCategorySchema,
      controller.upsertVendorExpenseCategory,
    ),
  );

router
  .route('/get-vendor-expense-category')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getVendorExpenseCategorySchema,
      controller.getVendorExpenseCategory,
    ),
  );
module.exports = router;
