const SamlRequest = require('./SamlRequest');
const SamlResponse = require('./SamlResponse');
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
      id: `_${uuid()}`,
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

  static async postResponse(req, res) {
    var authServerResponse = await SamlResponse.parse(req.body.SAMLResponse, true, config.authenticatingServer.publicKey);
    var context = config.services.cache.get(authServerResponse.inResponseTo);
    const now = new Date();

    var response = new SamlResponse({
      id: `_${uuid()}`,
      inResponseTo: context.original.request.id,
      issueInstant: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())),
      destination: context.original.request.issuer,
      issuer: 'http://me',
      status: authServerResponse.status,
      assertions: authServerResponse.assertions,
      sessionIndex: `_${uuid()}`,
      audience: context.original.request.issuer
    })

    res.render('redirecttooriginatingparty', {
      destination: context.original.request.issuer,
      samlResponse: response.toXmlString(config.crypto.signing.privateKey),
      relayState: context.original.relayState
    })

    res.type('xml');
    res.send(response.toXmlString(config.crypto.signing.privateKey));
  }
}

module.exports = SamlHandler;