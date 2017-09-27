const fs = require('fs');
const path = require('path');

const env = (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev');

module.exports = {
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
    url: (process.env.HOT_CONFIG_URL && process.env.HOT_CONFIG_URL.endsWith('/')) ? process.env.HOT_CONFIG_URL.substring(0, process.env.HOT_CONFIG_URL.length - 1) : process.env.HOT_CONFIG_URL,
    token: process.env.HOT_CONFIG_TOKEN
  },
  certificates: {
    storageRoot: path.resolve('./ssl')
  },
  crypto: {
    signing: {
      publicKey: fs.existsSync('./ssl/localhost.cert') ? fs.readFileSync('./ssl/localhost.cert', 'utf8') : null,
      privateKey: fs.existsSync('./ssl/localhost.cert') ? fs.readFileSync('./ssl/localhost.key', 'utf8') : null
    }
  }
};