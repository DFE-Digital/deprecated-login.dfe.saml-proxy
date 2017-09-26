const SamlResponse = require('./SamlResponse');
const uuid = require('./../Utils/Uuid');
const Config = require('./../Config');

module.exports = async (req, res) => {
  const authServerResponse = await SamlResponse.parse(req.body.SAMLResponse);
  const context = Config.services.cache.get(authServerResponse.inResponseTo);
  const client = Config.services.clients.get(context.original.request.issuer);
  const now = new Date();

  const certificate = Config.services.certificates.load(client.id);
  if(!authServerResponse.verify(certificate.publicKey)) {
    res.status(400);
    res.send('Received invalid response');
  }

  var response = new SamlResponse({
    id: `_${uuid()}`,
    inResponseTo: context.original.request.id,
    issueInstant: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())),
    destination: context.original.request.assertionConsumerServiceUrl,
    issuer: 'http://me',
    status: authServerResponse.status,
    assertions: authServerResponse.assertions,
    sessionIndex: `_${uuid()}`,
    audience: context.original.request.issuer
  })

  res.render('redirecttooriginatingparty', {
    destination: context.original.request.assertionConsumerServiceUrl,
    samlResponse: response.toXmlString(Config.crypto.signing.privateKey),
    relayState: context.original.relayState
  });
};