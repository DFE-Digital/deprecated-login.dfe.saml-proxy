const InMemoryCacheProvider = require('../Caching/InMemoryCacheProvider');
const StaticClientAdapter = require('../Clients/StaticClientAdapter');
const HotConfigClientAdapter = require('../Clients/HotConfigClientAdapter');
const FileSystemCertificateAdapter = require('../Certificates/FileSystemCertificateAdapter');
const fs = require('fs');
const path = require('path');

const env = (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev');

const hotConfigUrl = process.env.HOT_CONFIG_URL.endsWith('/') ? process.env.HOT_CONFIG_URL.substring(0, process.env.HOT_CONFIG_URL.length - 1) : process.env.HOT_CONFIG_URL;
const hotConfigToken = process.env.HOT_CONFIG_TOKEN;

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
    url: hotConfigUrl,
    token: hotConfigToken
  },
  services: {
    cache: new InMemoryCacheProvider(),
    clients: env == 'devmin' ? new StaticClientAdapter() : new HotConfigClientAdapter(hotConfigUrl, hotConfigToken, env),
    certificates: new FileSystemCertificateAdapter(path.resolve('./ssl'))
  },
  crypto: {
    signing: {
      publicKey: fs.readFileSync('./ssl/localhost.cert', 'utf8'),
      privateKey: fs.readFileSync('./ssl/localhost.key', 'utf8')
    }
  }
};