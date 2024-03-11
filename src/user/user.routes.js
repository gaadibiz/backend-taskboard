const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./user.controller');
const router = require('express').Router();
const Schema = require('./user.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert-user')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertUserSchema,
      controller.upsertUser,
    ),
  );

router
  .route('/update-profile')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertUserProfileSchema,
      controller.upsertUserProfile,
    ),
  );

router
  .route('/get-user')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getUserSchema, controller.getUser),
  );

router.route('/upsert-branch').post(
  // checkAuth,
  requestErrorHandlingDecorator(null, controller.upsertBranch),
);

router
  .route('/get-branch')
  .get(checkAuth, requestErrorHandlingDecorator(null, controller.getBranch));

router
  .route('/upsert-zone')
  .post(checkAuth, requestErrorHandlingDecorator(null, controller.upsertZone));

router
  .route('/get-zone')
  .get(checkAuth, requestErrorHandlingDecorator(null, controller.getZone));

router
  .route('/change-user-role')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.changeUserRole),
  );

router
  .route('/upsert-manage-site')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertManageSiteSchema,
      controller.upsertManageSite,
    ),
  );

router.route('/get-manage-site').get(
  // checkAuth,
  requestErrorHandlingDecorator(
    Schema.getManageSiteSchema,
    controller.getManageSite,
  ),
);

router.route('/upload-image').post(
  // checkAuth,
  requestErrorHandlingDecorator(null, controller.uploadImage),
);

module.exports = router;
