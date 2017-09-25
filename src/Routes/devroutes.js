const uuid = require('./../Utils/Uuid');
const SamlRequest = require('./../Saml/SamlRequest');
const config = require('./../Config')

class DevRoutes {
  static register(app) {
    app.get('/', DevRoutes.launchPad);
    app.post('/dev/samlresponse', DevRoutes.samlResponse);
  }

  static launchPad(req, res) {
    const serverBaseUrl = `${config.hostingEnvironment.protocol}://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`;
    const samlRequest = new SamlRequest('Authn', {
      id: uuid(),
      issueInstant: new Date(),
      destination: `${serverBaseUrl}/saml`,
      issuer: `${serverBaseUrl}/dev/samlresponse`,
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

  static samlResponse(req, res) {
    res.render('dev/samlresponse', {
      samlResponse: req.body.SAMLResponse,
      relayState: req.body.RelayState
    });
  }
}

module.exports = DevRoutes;