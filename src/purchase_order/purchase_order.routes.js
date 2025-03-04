const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./purchase_order.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./purchase_order.validation');

router
  .route('/upsert-purchase-order')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertPurchaseOrderSchema,
      controller.upsertPurchaseOrder,
    ),
  );

router
  .route('/get-purchase-order')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getPurchaseOrderSchema,
      controller.getPurchaseOrder,
    ),
  );

router
  .route('/get-po-preview')
  .get(
    requestErrorHandlingDecorator(
      Schema.getPOPreviewSchema,
      controller.getPOPreview,
    ),
  );

module.exports = router;
