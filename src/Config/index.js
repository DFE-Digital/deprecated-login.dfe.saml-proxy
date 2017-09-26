const InMemoryCacheProvider = require('../Caching/InMemoryCacheProvider');
const StaticClientAdapter = require('../Clients/StaticClientAdapter');
const FileSystemCertificateAdapter = require('../Certificates/FileSystemCertificateAdapter');
const fs = require('fs');
const path = require('path');

module.exports = {
  hostingEnvironment: {
    env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
    host: process.env.HOST ? process.env.HOST : 'localhost',
    port: process.env.PORT ? process.env.PORT : 4432,
    protocol: (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev') == 'dev' ? 'https' : 'http'
  },
  authenticatingServer: {
    url: process.env.AUTHENTICATING_SERVER_URL
  },
  services: {
    cache: new InMemoryCacheProvider(),
    clients: new StaticClientAdapter(),
    certificates: new FileSystemCertificateAdapter(path.resolve('./ssl'))
  },
  crypto: {
    signing: {
      publicKey: fs.readFileSync('./ssl/localhost.cert', 'utf8'),
      privateKey: fs.readFileSync('./ssl/localhost.key', 'utf8')
    }
  }
};