const fs = require('fs');
const path = require('path');

const env = (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev');

const hotConfigUrl  = process.env.HOT_CONFIG_URL ? process.env.HOT_CONFIG_URL : 'https://localhost:4432/';

module.exports = {
  loggerSettings: {
    levels: {
      info: 0,
      ok: 1,
      error: 2,
    },
    colors: {
      info: 'yellow',
      ok: 'green',
      error: 'red',
    },
  },
  hostingEnvironment: {
    env: env,
    host: process.env.HOST ? process.env.HOST : 'localhost',
    port: process.env.PORT ? process.env.PORT : 4432,
    protocol: env == 'dev' ? 'https' : 'http'
  },
  authenticatingServer: {
    url: process.env.AUTHENTICATING_SERVER_URL
  },
  hotConfig: {
    url: hotConfigUrl.endsWith('/') ? hotConfigUrl.substring(0, hotConfigUrl.length - 1) : hotConfigUrl,
    token: process.env.HOT_CONFIG_TOKEN ? process.env.HOT_CONFIG_TOKEN : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDY2NzYyODEsImV4cCI6NDY2MDI3NjI4MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCJ9.OOWQK63iIBzLXG7rx424fi10ae816_TRmW9SsR4NcmI'
  },
  certificates: {
    storageRoot: path.resolve('./ssl')
  }
};