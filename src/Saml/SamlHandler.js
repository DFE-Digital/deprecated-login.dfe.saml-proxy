const SamlRequest = require('./SamlRequest');
const uuid = require('./../Utils/Uuid');
const config = require('./../Config');

class SamlHandler {
    static register(app) {
        var instance = new SamlHandler();

        app.post('/saml/response', instance.postResponse);
        app.post('/saml', instance.postRequest);
    }

    postRequest(req, res) {
        const originalSamlRequest = SamlRequest.parse(req.body.SAMLRequest);
        const relayState = req.body.RelayState;

        const newSamlRequest = new SamlRequest('Authn', {
            id: uuid(),
            issueInstant: new Date(),
            destination: config.authenticatingServer.url,
            issuer: config.authenticatingServer.entityId,
            assertionConsumerServiceUrl: `${config.hostingEnvironment.protocol}://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}/saml/response`
        });

        res.render('redirecttoauthenticatingservice', {
            destination: config.authenticatingServer.url,
            samlRequest: newSamlRequest.toXmlString(),
            relayState: uuid()
        });
    }

    postResponse(req, res) {
        res.send('you posted a response');
    }
}

module.exports = SamlHandler;