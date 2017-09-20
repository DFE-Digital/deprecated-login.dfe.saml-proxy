const SamlRequest = require('./SamlRequest');
const uuid = require('./../Utils/Uuid');
const config = require('./../Config');

class SamlHandler {
  static register(app) {
    app.post('/saml/response', SamlHandler.postResponse);
    app.post('/saml', SamlHandler.postRequest);
  }

  static postRequest(req, res) {
    const originalSamlRequest = SamlRequest.parse(req.body.SAMLRequest);
    const relayState = req.body.RelayState;

    const newSamlRequest = new SamlRequest('Authn', {
      id: uuid(),
      issueInstant: new Date(),
      destination: config.authenticatingServer.url,
      issuer: config.authenticatingServer.entityId,
      assertionConsumerServiceUrl: `${config.hostingEnvironment.protocol}://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}/saml/response`
    });

    const context = {
      original: {
        request: originalSamlRequest,
        relayState: relayState
      },
      internal: {
        request: newSamlRequest,
        relayState: uuid()
      }
    };
    config.services.cache.set(newSamlRequest.id, context);

    res.render('redirecttoauthenticatingservice', {
      destination: config.authenticatingServer.url,
      samlRequest: newSamlRequest.toXmlString(),
      relayState: context.internal.relayState
    });
  }

  static postResponse(req, res) {
    res.send('you posted a response');
  }
}

module.exports = SamlHandler;