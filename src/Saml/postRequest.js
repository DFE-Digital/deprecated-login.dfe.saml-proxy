const SamlRequest = require('./SamlRequest');
const uuid = require('./../Utils/Uuid');
const Config = require('./../Config');
const Clients = require('./../Clients');
const Cache = require('./../Caching');

const clientAdapter = new Clients();
const cache = new Cache();

module.exports = async (req, res) => {
  const originalSamlRequest = SamlRequest.parse(req.body.SAMLRequest);
  const relayState = req.body.RelayState;
  const logger = req.app.get('logger');

  logger.info(`Recieved HTTPPOST request for issuer '${originalSamlRequest.issuer}'`);

  const client = await clientAdapter.get(originalSamlRequest.issuer);
  if(client == null) {
    logger.info(`Cannot find client for issuer '${originalSamlRequest.issuer}'`);
    res.status(400);
    res.send('Invalid request');
    return;
  }
  if(!originalSamlRequest.validate(client)) {
    logger.info(`Validation failed for issuer '${originalSamlRequest.issuer}' / client '${client.id}'`);
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
  cache.set(newSamlRequest.id, context);

  res.render('redirecttoauthenticatingservice', {
    destination: Config.authenticatingServer.url,
    samlRequest: newSamlRequest.toXmlString(),
    relayState: context.internal.relayState
  });
};