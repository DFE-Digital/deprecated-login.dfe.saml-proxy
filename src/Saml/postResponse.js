const SamlResponse = require('./SamlResponse');
const uuid = require('./../Utils/Uuid');
const clients = require('./../Clients');
const cache = require('./../Caching');
const certificates = require('./../Certificates');


module.exports = async (req, res) => {
  const authServerResponse = await SamlResponse.parse(req.body.SAMLResponse);
  const context = cache.get(authServerResponse.inResponseTo);
  const client = await clients.get(context.original.request.issuer);
  const now = new Date();

  const certificate = certificates.load(client.id);
  if (!authServerResponse.verify(certificate.publicKey)) {
    res.status(400).send('Received invalid response');
    return;
  }

  const response = new SamlResponse({
    id: `_${uuid()}`,
    inResponseTo: context.original.request.id,
    issueInstant: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())),
    destination: context.original.request.assertionConsumerServiceUrl,
    issuer: 'http://me',
    status: authServerResponse.status,
    assertions: authServerResponse.assertions,
    sessionIndex: `_${uuid()}`,
    audience: context.original.request.issuer,
  });

  const signingCert = certificates.load('saml-signing', true);
  // eslint-disable-next-line no-buffer-constructor
  const encodedResponse = new Buffer(response.toXmlString(signingCert.privateKey)).toString('base64');
  res.render('redirecttooriginatingparty', {
    destination: context.original.request.assertionConsumerServiceUrl,
    samlResponse: encodedResponse,
    relayState: context.original.relayState,
  });
};
