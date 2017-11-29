const Config = require('./../Config');

module.exports = Config.hostingEnvironment.env === 'devoffline' ? require('./StaticClientAdapter') : require('./HotConfigClientAdapter');
