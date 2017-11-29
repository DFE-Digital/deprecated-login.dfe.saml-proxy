const { Buffer } = require('buffer');
const { DOMParser } = require('xmldom');

const SamlRequest = require('./../../../src/Saml/SamlRequest');

const getXmlDoc = (request) => {
  const actual = request.toXmlString();
  const xml = Buffer.from(actual, 'base64').toString();
  return new DOMParser().parseFromString(xml);
}

describe('When making an XML string', () => {
  describe('for an Authn request', () => {
    let authnRequest;

    beforeEach(() => {
      authnRequest = new SamlRequest('Authn', {
        id: '6a5a3e52-9d3d-11e7-abc4-cec278b6b50a',
        issueInstant: new Date(Date.UTC(2017, 8, 12, 19, 36, 42)),
        destination: 'http://auth.server',
        issuer: 'http://entity.id',
        assertionConsumerServiceUrl: 'http://proxy.url/saml/response',
      });
    });

    it('then it should return valid AuthnRequest XML encoded to base64', () => {
      const actual = getXmlDoc(authnRequest);

      expect(actual).not.toBeNull();
      expect(actual.documentElement).not.toBeNull();
      expect(actual.documentElement.localName).toBe('AuthnRequest');
    });

    it('then it should set generic attributes', () => {
      const actual = getXmlDoc(authnRequest);

      expect(actual.documentElement.getAttribute('ID')).toBe('6a5a3e52-9d3d-11e7-abc4-cec278b6b50a');
      expect(actual.documentElement.getAttribute('IssueInstant')).toBe('2017-09-12T19:36:42Z');
      expect(actual.documentElement.getAttribute('Destination')).toBe('http://auth.server');
      expect(actual.documentElement.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', 'Issuer')[0].childNodes[0].data).toBe('http://entity.id');
    });

    it('then it should set Authn attributes', () => {
      const actual = getXmlDoc(authnRequest);

      expect(actual.documentElement.getAttribute('AssertionConsumerServiceURL')).toBe('http://proxy.url/saml/response');
    });
  });
});
