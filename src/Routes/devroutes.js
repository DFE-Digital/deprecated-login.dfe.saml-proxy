const uuid = require('./../Utils/Uuid');
const SamlRequest = require('./../Saml/SamlRequest');
const config = require('./../Config')

class DevRoutes {
  static register(app) {
    app.get('/', DevRoutes.launchPad);
  }

  static launchPad(req, res) {
    const serverBaseUrl = `${config.hostingEnvironment.protocol}://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`;
    const samlRequest = new SamlRequest('Authn', {
      id: uuid(),
      issueInstant: new Date(),
      destination: `${serverBaseUrl}/saml`,
      issuer: `${serverBaseUrl}/`,
      assertionConsumerServiceUrl: `${serverBaseUrl}/dev/samlresponse`
    });

    res.render('dev/launchPad', {
      auth: {
        destination:`${serverBaseUrl}/saml`,
        samlRequest: samlRequest.toXmlString(),
        relayState: uuid()
      }
    });
  }
}

module.exports = DevRoutes;