const SamlRequest = require('./SamlRequest');
const uuid = require('./../Utils/Uuid');

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
            destination: 'AUTHENTICATING_SAML_ENDPOINT',
            issuer: 'ENTITY_ID',
            assertionConsumerServiceUrl: 'https://localhost:4432/saml/response'
        });

        res.render('redirecttoauthenticatingservice', {
            destination: 'AUTHENTICATING_SAML_ENDPOINT',
            samlRequest: newSamlRequest.toXmlString(),
            relayState: uuid()
        });
    }

    postResponse(req, res) {
        res.send('you posted a response');
    }
}

module.exports = SamlHandler;