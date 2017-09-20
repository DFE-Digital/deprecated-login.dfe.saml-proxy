const SamlHandler = require('../Saml/SamlHandler');
const DevRoutes = require('./devroutes');
const config = require('./../Config');

class Routes {
  static register(app) {
    SamlHandler.register(app);

    if (config.hostingEnvironment.env == 'dev') {
      DevRoutes.register(app);
    }
  }
}

module.exports = Routes;