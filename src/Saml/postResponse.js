const SamlResponse = require('./SamlResponse');
const uuid = require('./../Utils/Uuid');
const Config = require('./../Config');
const Clients = require('./../Clients');
const Cache = require('./../Caching');
const Certificates = require('./../Certificates');

const clientAdapter = new Clients();
const cache = new Cache();
const certificateAdapter = new Certificates();

module.exports = async (req, res) => {
  const authServerResponse = await SamlResponse.parse(req.body.SAMLResponse);
  const context = cache.get(authServerResponse.inResponseTo);
  const client = await clientAdapter.get(context.original.request.issuer);
  const now = new Date();

  const certificate = certificateAdapter.load(client.id);
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

  const signingCert = certificateAdapter.load('saml-signing');
  res.render('redirecttooriginatingparty', {
    destination: context.original.request.assertionConsumerServiceUrl,
    samlResponse: response.toXmlString(signingCert.privateKey),
    relayState: context.original.relayState
  });
};