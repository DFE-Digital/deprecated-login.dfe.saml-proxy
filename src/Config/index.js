const InMemoryCacheProvider = require('./../Caching/InMemoryCacheProvider');

module.exports = {
  hostingEnvironment: {
    env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
    host: process.env.HOST ? process.env.HOST : 'localhost',
    port: process.env.PORT ? process.env.PORT : 4432,
    protocol: (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev') == 'dev' ? 'https' : 'http'
  },
  authenticatingServer: {
    url: process.env.AUTHENTICATING_SERVER_URL,
    entityId: process.env.AUTHENTICATING_SERVER_ENTITYID
  },
  services: {
    cache: new InMemoryCacheProvider()
  }
};