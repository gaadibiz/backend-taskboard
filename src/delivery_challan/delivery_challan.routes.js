const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./delivery_challan.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./delivery_challan.validation');

router
  .route('/upsert-delivery-challan')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertDeliveryChallanSchema,
      controller.upsertDeliveryChallan,
    ),
  );

router
  .route('/get-delivery-challan')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getDeliveryChallanSchema,
      controller.getDeliveryChallan,
    ),
  );

router
  .route('/get-delivery-challan-preview')
  .get(
    requestErrorHandlingDecorator(
      Schema.getDeliveryChallanPreviewSchema,
      controller.getDeliveryChallanPreview,
    ),
  );
module.exports = router;
