const {
  otpHandler,
  getRecords,
  updateRecord,
  insertRecords,
  isRecordExist,
  isValidRecord,
  isEditAccess,
} = require('../../utils/dbFunctions');
const {
  responser,
  throwError,
  deleteKeyValuePair,
  removeNullValueKey,
  getData,
} = require('../../utils/helperFunction');
const { otpConst } = require('../../utils/constants/otp');
const { sendEmailService } = require('../../utils/microservice_func');
const { userSessionService } = require('./authentication.service');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/server.config');

require('dotenv').config();

exports.userVerification = async (req, res) => {
  const { email, otp, action } = req.body;
  let user = await getRecords(
    'latest_user',
    `where email='${email}' and status='UNAUTHORIZE'`,
  );
  if (!user.length) throwError(401, 'Invalid user request.');
  user = user[0];
  if (action === 'SEND') {
    let otp = await otpHandler(user.user_uuid, otpConst['user verification']);
    await sendEmailService(
      [req.body.email],
      'User verification OTP',
      `Here is your user verification OTP: ${otp}.`,
    );
    return res.json(responser('Invite email has been sent.'));
  } else {
    let isValidOtp = await otpHandler(
      user.user_uuid,
      otpConst['user verification'],
      otp,
    );
    if (!isValidOtp) throwError(406, 'Invalid OTP.');
    await updateRecord('user_fact', { status: 'ACTIVE' }, { email });
    res.json(responser('User verified successfully.'));
  }
};

exports.loginUser = async (req, res, next) => {
  const otpEnabled = process.env.OTP_ENABLED;
  let userDetail = await getRecords(
    'latest_user',
    `where email='${req.body.email}' AND (status='ACTIVE')`,
  );

  if (!userDetail.length) throwError(404, 'Email or password invalid.');
  let bol = bycrpt.compareSync(req.body.password, userDetail[0].user_password);
  if (!bol) throwError(404, 'Email or password invalid.');

  delete userDetail[0].user_password;
  delete userDetail[0].insert_ts;
  let payload = {
    first_name: userDetail[0].first_name,
    user_uuid: userDetail[0].user_uuid,
    email: userDetail[0].email,
    role_uuid: userDetail[0].role_uuid,
    role_name: userDetail[0].role_name,
    role_value: userDetail[0].role_value,
    branch_uuid: userDetail[0].branch_uuid,
  };

  let jwtOption = {
    expiresIn: config.jwt.jwtAccessExpiredIn,
  };
  if (userDetail[0].role_value === 'SUPERADMIN') {
    deleteKeyValuePair(jwtOption, ['expiresIn']);
  }
  let token = jwt.sign(payload, config.jwt.jwtAccessKey, jwtOption);

  console.log('userDetail[0].user_uuid: ', userDetail[0].user_uuid);
  await userSessionService({
    user_uuid: userDetail[0].user_uuid,
    accessToken: token,
  });

  let isOTPPreview = false;
  if (otpEnabled === 'true') {
    let otp = await otpHandler(userDetail[0].user_uuid, otpConst.login);
    let name = userDetail[0].first_name;

    try {
      let resp = await sendEmailService(
        [userDetail[0].email],
        'Login OTP',
        `Hi ${name}, your OTP: ${otp}`,
      );
      isOTPPreview = true;
      return res.json(responser(resp.message, { isOTPPreview, otp }));
    } catch (e) {
      console.log(e);
      return res.json(responser('Email has not been sent yet.', otp));
    }
  } else {
    return res.json(
      responser('Login successful.', {
        token,
        isOTPPreview,
        user: userDetail[0],
      }),
    );
  }
};

exports.validateOtpGetToken = async (req, res, next) => {
  const { email, otp } = req.body;
  let user = await getRecords(
    'latest_user',
    `where email='${email}' and status='ACTIVE'`,
  );
  if (!user.length) throwError(401, 'Invalid user request.');
  user = user[0];
  let isValid = await otpHandler(user.user_uuid, 'LOGIN', otp);
  if (!isValid) return res.status(401).json(responser('Invalid OTP'));
  let getToken = await getRecords(
    'user_session',
    `where user_uuid='${user.user_uuid}'`,
  );
  deleteKeyValuePair(user, [
    'user_fact_id',
    'user_password',
    'created_by_uuid',
    'insert_ts',
    'create_ts',
    'user_dim_id',
  ]);
  return res.json(
    responser('Login Successfully', {
      access_token: getToken[0].access_token,
      user,
    }),
  );
};
exports.generateOtp = async (req, res) => {
  let { email, otp_for } = req.body;
  let isUserExist = await getRecords(
    'latest_user',
    `WHERE email = '${email}' AND status = 'ACTIVE'`,
  );
  console.log('data', isUserExist.length);
  if (!isUserExist?.length) throwError(404, 'Invalid user.');
  let otp = await otpHandler({
    user_fact_id: isUserExist[0].user_fact_id,
    otp_for: otp_for,
  });
  try {
    await sendEmailService(
      [email],
      `OTP FOR , ${otp_for}`,
      `<H1>Your otp for ${otp_for} is  ${otp} </H1>`,
      null,
      null,
      [],
      [],
      null,
      [],
    );
    return res.json(responser('Otp has been sent to your email'));
  } catch (e) {
    console.log('Error in email service' + e);
    throwError(500, 'Email is not send!');
  }
};

exports.forgetPassword = async (req, res) => {
  let { email, otp, user_password, action } = req.body;
  let user = await getRecords(
    'latest_user',
    `WHERE email = '${email}' AND status = 'ACTIVE'`,
  );
  if (!user.length) throwError(401, 'Invalid user.');
  user = user[0];
  if (action === 'SEND') {
    let otp = await otpHandler(user.user_uuid, otpConst['forget password']);
    await sendEmailService(
      [req.body.email],
      'Forget password',
      `Here is your user verification OTP: ${otp}.`,
    );
    return res.json(responser('Email has been sent.'));
  } else {
    let isValid = await otpHandler(
      user.user_uuid,
      otpConst['forget password'],
      otp,
    );
    if (!isValid) throwError(401, 'Invalid otp.');
    user.user_password = bycrpt.hashSync(user_password, 10);
    await insertRecords('user_dim', user);
    return res.json(responser('Password Updated!'));
  }
};

exports.logout = async (req, res) => {
  await userSessionService(req.body);
  return res.json(responser('Logout successfully.'));
};
