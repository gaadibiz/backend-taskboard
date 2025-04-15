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

router.get(
  '/get-advance-amount',
  checkAuth,
  requestErrorHandlingDecorator(
    Schema.getAdvanceAmount,
    controller.getAdvanceAmount,
  ),
);

router.post(
  '/convert-finance-to-cleared',
  checkAuth,
  requestErrorHandlingDecorator(
    Schema.convertFinanceToCleared,
    controller.convertFinanceToCleared,
  ),
);
router.post(
  '/export-finance-expense',
  checkAuth,
  requestErrorHandlingDecorator(
    Schema.exportFinanceExpense,
    controller.exportFinanceExpense,
  ),
);

router.get(
  '/get-preview-expense',
  checkAuth,
  requestErrorHandlingDecorator(
    Schema.getPreviewExpense,
    controller.getPreviewExpense,
  ),
);

router
  .route('/get-expense-dynamic-approval-history')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getExpenseDynamicApprovalHistorySchema,
      controller.getExpenseDynamicApprovalHistory,
    ),
  );

module.exports = router;
