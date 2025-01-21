require('dotenv').config();
module.exports = {
  PORT: process.env.PORT,
  jwt: {
    jwtAccessKey: process.env.JWT_ACCESS_SECRET,
    jwtAccessExpiredIn: process.env.JWT_ACCESS_EXPIRED_IN,
  },
  crypto: {
    cryptoSecret: process.env.CRYPTO_SECRET,
  },
  bcrypt: {
    saltLength: 10,
  },

  base_url: process.env.DEV_SERVER
    ? process.env.DEV_SERVER + ':' + process.env.PORT
    : process.env.STAGGING_SERVER
      ? process.env.STAGGING_SERVER
      : process.env.PROD_SERVER,
  swagger_develope_contact: process.env.DEVELOP_EMAIL,
  appConfig: {
    OTP: process.env.OTP,
  },
  genai: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};
