const express = require('express');

const swaggerUI = require('swagger-ui-express');

const app = express();
const cors = require('cors');
const config = require('./config/server.config');
const {
  readDirectory,
  responser,
  readFileContent,
} = require('./utils/helperFunction');

app.use(express.json());
app.use(cors());

const swagger = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'swagger',
    description: 'Swagger Api Docs',
    contact: {
      email: config.swagger_develope_contact,
    },
  },
  paths: {},
};
const appendRoutes = async (folder) => {
  try {
    let arrayList = await readDirectory(folder);
    if (arrayList.length) {
      for (let ele of arrayList) {
        if (!ele.includes('.')) {
          await appendRoutes(folder + '/' + ele);
        }
        if (ele.endsWith('.routes.js')) {
          app.use(
            // this will make api endpoint like /api/v1/{file name without route.js}/{your specified endpoint in that file}
            `/api/v1/${ele.split('.')[0]}`,
            // this will make api endpoint like /api/v1/{last folder name}/{file name without route.js}/{your specified endpoint in that file}
            // `/api/v1/${folder.split('/').at(-1)}/${ele.split('.')[0]}`,
            require(`./${folder}/${ele}`),
          );
        }
        if (ele.endsWith('.swagger.json')) {
          let swaggerPayload = JSON.parse(await readFileContent(folder, ele));
          swagger.paths = { ...swagger.paths, ...swaggerPayload.paths };
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
  app.get('/', async (req, res) => {
    res.status(200).json(responser('Welcome to Server.'));
  });
};
appendRoutes('src');

app.listen(config.PORT, () => {
  console.log('Server is running at:', config.base_url);
});
