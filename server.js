const express = require('express');

const {
  SSEServerTransport,
} = require('@modelcontextprotocol/sdk/server/sse.js');

const swaggerUI = require('swagger-ui-express');
const fileUpload = require('express-fileupload');

const app = express();
const cors = require('cors');
const config = require('./config/server.config');
const {
  readDirectory,
  responser,
  readFileContent,
} = require('./utils/helperFunction');
const McpServerInstance = require('./utils/mcpServer');

app.use(cors());

// mcp server

const transports = {};

app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  //   Content-Type: text/event-stream
  // Cache-Control: no-cache
  // Connection: keep-alive
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.on('close', () => {
    delete transports[transport.sessionId];
  });
  await McpServerInstance.connect(transport);
});

app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.use(express.json());
// Enable file uploads
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

// to serve static files from img folder
app.use('/img', express.static('img'));

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
    res.status(200).json(responser('Welcome to Server'));
  });
};
appendRoutes('src');

app.listen(config.PORT, () => {
  console.log('Server is running at:', config.base_url + `/api-docs`);
});
