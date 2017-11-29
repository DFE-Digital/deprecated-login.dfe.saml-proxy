const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const https = require('https');
const config = require('./Config');
const saml = require('./Saml');
const devLauncher = require('./DevLauncher');

const app = express();
const logger = new (winston.Logger)({
  colors: config.loggerSettings.colors,
  transports: [
    new (winston.transports.Console)({ level: 'info', colorize: true }),
  ],
});

// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('logger', logger);
app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(morgan('dev'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// Setup routes
app.use('/saml', saml());
app.use('/', devLauncher());

// Setup server
if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;


  const options = {
    key: config.hostingEnvironment.sslKey,
    cert: config.hostingEnvironment.sslCert,
    requestCert: false,
    rejectUnauthorized: false,
  };
  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(`Dev server listening on http://${config.hostingEnvironment.host}:${process.env.PORT}`);
  });
}
