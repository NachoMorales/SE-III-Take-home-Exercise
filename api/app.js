import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import fs from 'fs';
import settings from './config/settings';

const app = express();

const serverHTTP = http.createServer(app);

// libraries
const lib = {
  httpError: (status, message) => {
    const result = new Error(message);

    result.status = status || 400;

    return result;
  },
  fs,
  mongodb: {
    mongoose: require('mongoose'),
    plugins: [require('mongoose-unique-validator'), require('@meanie/mongoose-to-json')]
  },
};


// Cache control
app.disable('etag');

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, x-accepted-format');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));

// Database
global.database = { mongodb: lib.mongodb };


const normalizeFileName = value => value
  .replace(/\.js$/, '')
  .replace(/\./g, ' ')
  .replace(/_/g, ' ')
  .replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

const baseRoutes = require(`${__dirname}/routes`);

const handleFiles = type => {
  const path = `${__dirname}/${type}`;
  const loadedFiles = {};

  lib.fs.readdirSync(path).forEach(folder => {
    const code = normalizeFileName(folder);
    const folderPath = `${path}/${folder}`;

    lib.fs.readdirSync(folderPath)
      .filter(file => file.match(/\.js$/))
      .forEach(file => {
        const name = normalizeFileName(file);

        loadedFiles[code] = loadedFiles[code] || {};
        loadedFiles[code][name] = require(`${folderPath}/${file}`);
      });
  });

  global[type] = {};

  for (const fileCode in loadedFiles) {
    global[type][fileCode] = {
      settings,
      app,
      lib,
      router: express.Router()
    };

    for (const fileName in loadedFiles[fileCode]) {
      if (loadedFiles[fileCode][fileName] && typeof loadedFiles[fileCode][fileName] === 'function') {
        try {
          const callback = loadedFiles[fileCode][fileName](global[type][fileCode]);
          if (type === 'helpers') global[type][fileCode][fileName] = callback;

        } catch (error) {
          console.error(`${type} "${fileCode}.${fileName}" not loaded`);
          console.error(error);
        }
      }
    }

    if (type === 'modules') {
      baseRoutes(global[type][fileCode]);

      if (global[type][fileCode].schema) {
        for (const plugin of global.database.mongodb.plugins) global[type][fileCode].schema.plugin(plugin);

        global[type][fileCode].model = global.database.mongodb.mongoose.model(fileCode, global[type][fileCode].schema);
      }

      app.use(`/api/${fileCode}/`, global[type][fileCode].router);
    }
  }
}

handleFiles('helpers');
handleFiles('modules');


app.use('/api', ({ status, error, message }, req, res, next) => {
  res.status(status || 400).send(error || { message });
});

export { serverHTTP };
