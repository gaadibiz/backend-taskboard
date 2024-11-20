const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./expense.controller');
const router = require('express').Router();
const Schema = require('./expense.validation');
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
  .route('/upsert-expense-category')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertExpenseCategory,
      controller.upsertExpenseCategory,
    ),
  );

router
  .route('/get-expense-category')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getExpenseCategory,
      controller.getExpenseCategory,
    ),
  );

module.exports = router;
