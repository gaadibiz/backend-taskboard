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

  console.log(req.query, '...........................');
  if (!token) return res.status(404).json(responser('Token not found.'));

  jwt.verify(token, config.jwt.jwtAccessKey, async (err, user) => {
    if (err) return res.status(401).json(responser('Invalid token.'));
    let result = await getCountRecord(
      'user_session',
      `where user_uuid='${user.user_uuid}' AND access_token='${token}'`,
    );
    if (result !== 1) return res.status(401).json(responser('Invalid token.'));
    req.user = user;

    console.log(user, '................................................user');
    if (req.method === 'POST') {
      if (Array.isArray(req.body)) {
        req.body = req.body.map((item) => {
          return {
            ...item,
            created_by_uuid: user.user_uuid, // handle create_by_id for every table
            created_by_name: user.full_name,
            modified_by_uuid: user.user_uuid,
            modified_by_name: user.full_name,
          };
        });
      } else {
        req.body = {
          ...req.body,

          created_by_uuid: user.user_uuid, // handle create_by_id for every table
          created_by_name: user.full_name,
          modified_by_uuid: user.user_uuid,
          modified_by_name: user.full_name,
        };
      }
    }

    // if (req.method === 'POST') {
    //   if (Array.isArray(req.body)) {
    //     console.log("req.body post 1: ", req.body);
    //     req.body = req.body.map((item) => {
    //       console.log("post 1");
    //       return {
    //         ...item,
    //         created_by_uuid: item.created_by_uuid || user.user_uuid, // handle create_by_id for every table
    //         modified_by_uuid: item.created_by_uuid ? user.user_uuid : null, // handle modified_by_id for every table
    //       };
    //     });
    //   } else {
    //     console.log("req.body post 2: ", req.body);
    //     let modified_by_uuid;
    //     if(req.body.created_by_uuid) {
    //       modified_by_uuid = user.user_uuid;
    //     } else {
    //       modified_by_uuid = null;
    //       created_by_uuid = user.user_uuid;
    //     }
    //     console.log("cretedby uuid: ", created_by_uuid);
    //     console.log("modisifed uuid: ", modified_by_uuid);
    //     // const created_by_uuid = req.body.created_by_uuid || user.user_uuid;
    //     // const modified_by_uuid = req.body.created_by_uuid ? user.user_uuid : null;
    //     console.log("post 2");

    //     req.body = {

    //       ...req.body,
    //       created_by_uuid,
    //       modified_by_uuid, // handle modified_by_id for every table
    //     };
    //   }
    // }

    next();
  });
};

module.exports = checkAuth;
