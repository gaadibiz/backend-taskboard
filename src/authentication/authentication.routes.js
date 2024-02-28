const checkAuth = require('../../middleware/checkAuth');
const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./authentication.controller');
const Schema = require('./authentication.validation');
const router = require('express').Router();

router
  .route('/user-verification')
  .post(
    requestErrorHandlingDecorator(
      Schema.userVerification,
      controller.userVerification,
    ),
  );

router
  .route('/login')
  .post(requestErrorHandlingDecorator(Schema.userLogin, controller.loginUser));

router
  .route('/validate-otp-get-token')
  .post(
    requestErrorHandlingDecorator(
      Schema.validateOtpGetToken,
      controller.validateOtpGetToken,
    ),
  );

router
  .route('/forget-password')
  .post(
    requestErrorHandlingDecorator(
      Schema.forgetPassword,
      controller.forgetPassword,
    ),
  );

router
  .route('/logout')
  .put(requestErrorHandlingDecorator(Schema.userLogout, controller.logout));

module.exports = router;
