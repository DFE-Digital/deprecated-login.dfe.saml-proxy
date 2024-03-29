const { Buffer } = require('buffer');
const SamlRequest = require('./../../../src/Saml/SamlRequest');

describe('When parsing a valid request', () => {
  describe('that is an AuthnRequest', () => {
    const validAuthnRequest = new Buffer('<saml2p:AuthnRequest xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" \n' +
            '                     xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" \n' +
            '                     ID="idf6a91730cfe0410791224c3ff6e7281e" \n' +
            '                     Version="2.0" \n' +
            '                     IssueInstant="2017-09-18T06:45:24Z" \n' +
            '                     Destination="http://localhost:8472/Saml" \n' +
            '                     AssertionConsumerServiceURL="http://localhost:6948/AuthServices/Acs">\n' +
            '  <saml2:Issuer>https://localhost:3941/1232190a</saml2:Issuer>\n' +
            '</saml2p:AuthnRequest>').toString('base64');

    it('then it should return an instance of SamlRequest that has type Authn', async () => {
      const actual = await SamlRequest.parse(validAuthnRequest);

      expect(actual).not.toBeNull();
      expect(actual).toHaveProperty('type','Authn');
    });

    it('then it should parse generic properties from request', async () => {
      const actual = await SamlRequest.parse(validAuthnRequest);

      expect(actual.id).toBe('idf6a91730cfe0410791224c3ff6e7281e');
      expect(actual.destination).toBe('http://localhost:8472/Saml');
      expect(actual.issuer).toBe('https://localhost:3941/1232190a');

      expect(actual.issueInstant.getUTCFullYear()).toBe(2017);
      expect(actual.issueInstant.getUTCMonth()).toBe(8);
      expect(actual.issueInstant.getUTCDate()).toBe(18);
      expect(actual.issueInstant.getUTCHours()).toBe(6);
      expect(actual.issueInstant.getUTCMinutes()).toBe(45);
      expect(actual.issueInstant.getUTCSeconds()).toBe(24);
    });

    it('then it should parse specific Authn properties from request', async () => {
      const actual = await SamlRequest.parse(validAuthnRequest);

      expect(actual.assertionConsumerServiceUrl).toBe('http://localhost:6948/AuthServices/Acs');
    });
  });
});
