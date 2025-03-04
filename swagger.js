const { readFileContent } = require('./common/helperFunction');

exports.swagger = async () => {
  let authSwagger = await readFileContent(
    './src/authentication',
    'authentication.swagger.json',
  );
  authSwagger = JSON.parse(authSwagger);
  // console.log(authSwagger.paths);

  return {
    swagger: '2.0',
    info: {
      version: '1.0.0',
      title: 'swagger',
      description: 'Swagger Api Docs',
      contact: {
        email: 'zafar1219@gmail.com',
      },
    },
    paths: {
      ...authSwagger.paths,
    },
  };
};
// exports.swagger = {
//   swagger: '2.0',
//   info: {
//     version: '1.0.0',
//     title: 'swagger',
//     description: 'Swagger Api Docs',
//     contact: {
//       email: 'zafar1219@gmail.com',
//     },
//   },
//   paths: (async()=>{
//     await fetchSwaggers()
//   })()
// };
