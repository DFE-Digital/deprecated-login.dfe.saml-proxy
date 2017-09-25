const SamlRequest = require('./SamlRequest');
const uuid = require('./../Utils/Uuid');
const Config = require('./../Config');

module.exports = (req, res) => {
  const originalSamlRequest = SamlRequest.parse(req.body.SAMLRequest);
  const relayState = req.body.RelayState;

  const client = Config.services.clients.get(originalSamlRequest.issuer);
  if(client == null) {
    res.status(400);
    res.send('');
    return;
  }
  if(!originalSamlRequest.validate(client)) {
    res.status(400);
    res.send('');
    return;
  }

  const newSamlRequest = new SamlRequest('Authn', {
    id: `_${uuid()}`,
    issueInstant: new Date(),
    destination: Config.authenticatingServer.url,
    issuer: Config.authenticatingServer.entityId,
    assertionConsumerServiceUrl: `${Config.hostingEnvironment.protocol}://${Config.hostingEnvironment.host}:${Config.hostingEnvironment.port}/saml/response`
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
  Config.services.cache.set(newSamlRequest.id, context);

  res.render('redirecttoauthenticatingservice', {
    destination: Config.authenticatingServer.url,
    samlRequest: newSamlRequest.toXmlString(),
    relayState: context.internal.relayState
  });
};