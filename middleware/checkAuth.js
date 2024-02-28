const jwt = require('jsonwebtoken');
const { responser } = require('../utils/helperFunction');
const { getCountRecord } = require('../utils/dbFunctions');
const config = require('../config/server.config');
const checkAuth = (req, res, next) => {
  const token = req.header('auth-Token');
  const authKey = req.query['auth-Key'];
  if (authKey) {
    if (authKey !== process.env.AUTH_KEY)
      return res.status(401).json(responser('Invalid Auth Key.'));
    return next();
  }
  if (!token) return res.status(404).json(responser('Token not found.'));

  jwt.verify(token, config.jwt.jwtAccessKey, async (err, user) => {
    if (err) return res.status(401).json(responser('Invalid token.'));
    let result = await getCountRecord(
      'user_session',
      `where user_uuid='${user.user_uuid}' AND access_token='${token}'`,
    );
    if (result !== 1) return res.status(401).json(responser('Invalid token.'));
    req.user = user;
    if (req.method === 'POST') {
      if (Array.isArray(req.body)) {
        req.body = req.body.map((item) => {
          return {
            ...item,
            created_by_uuid: user.user_uuid, // handle create_by_id for every table
          };
        });
      } else {
        req.body = {
          ...req.body,
          created_by_uuid: user.user_uuid, // handle create_by_id for every table
        };
      }
    }
    next();
  });
};

module.exports = checkAuth;
