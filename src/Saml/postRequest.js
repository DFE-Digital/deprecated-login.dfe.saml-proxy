const SamlRequest = require('./SamlRequest');
const uuid = require('./../Utils/Uuid');
const Config = require('./../Config');
const Clients = require('./../Clients');

const clientAdapter = new Clients();

module.exports = async (req, res) => {
  const originalSamlRequest = SamlRequest.parse(req.body.SAMLRequest);
  const relayState = req.body.RelayState;

  const client = await clientAdapter.get(originalSamlRequest.issuer);
  if(client == null) {
    res.status(400);
    res.send('Invalid request');
    return;
  }
  if(!originalSamlRequest.validate(client)) {
    res.status(400);
    res.send('Invalid request');
    return;
  }

  const newSamlRequest = new SamlRequest('Authn', {
    id: `_${uuid()}`,
    issueInstant: new Date(),
    destination: Config.authenticatingServer.url,
    issuer: client.identifierUri,
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