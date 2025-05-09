const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const router = require('express').Router();
const controller = require('./inventory.controller');
const Schema = require('./inventory.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert_inventory')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertInventorySchema,
      controller.upsertInventory,
    ),
  );

router
  .route('/get-inventory')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getInventorySchema,
      controller.getInventory,
    ),
  );
module.exports = router;
