const InMemoryCacheProvider = require('../Caching/InMemoryCacheProvider');
const StaticClientAdapter = require('../Clients/StaticClientAdapter');
const fs = require('fs');

module.exports = {
  hostingEnvironment: {
    env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
    host: process.env.HOST ? process.env.HOST : 'localhost',
    port: process.env.PORT ? process.env.PORT : 4432,
    protocol: (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev') == 'dev' ? 'https' : 'http'
  },
  authenticatingServer: {
    url: process.env.AUTHENTICATING_SERVER_URL,
    entityId: process.env.AUTHENTICATING_SERVER_ENTITYID,
    publicKey: fs.readFileSync('./ssl/authserver.cert', 'utf8')
  },
  services: {
    cache: new InMemoryCacheProvider(),
    clients: new StaticClientAdapter()
  },
  crypto: {
    signing: {
      publicKey: fs.readFileSync('./ssl/localhost.cert', 'utf8'),
      privateKey: fs.readFileSync('./ssl/localhost.key', 'utf8')
    }
  }
};