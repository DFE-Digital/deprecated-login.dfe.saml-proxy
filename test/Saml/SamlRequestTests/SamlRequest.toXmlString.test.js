const expect = require('chai').expect;

const Buffer = require('buffer').Buffer;
const DOMParser = require('xmldom').DOMParser;

const SamlRequest = require('./../../../src/Saml/SamlRequest');

describe('When making an XML string', function() {

        describe('for an Authn request', function() {
            let authnRequest;

            beforeEach(function() {
                authnRequest = new SamlRequest('Authn', {
                    id: '6a5a3e52-9d3d-11e7-abc4-cec278b6b50a',
                    issueInstant: new Date(Date.UTC(2017, 8, 12, 19, 36, 42)),
                    destination: 'http://auth.server',
                    issuer: 'http://entity.id',
                    assertionConsumerServiceUrl: 'http://proxy.url/saml/response'
                });
            });

            it('then it should return valid AuthnRequest XML encoded to base64', function() {
                const actual = _GetXmlDoc(authnRequest);

                expect(actual).to.not.be.null;
                expect(actual.documentElement).to.not.be.null;
                expect(actual).to.have.property('documentElement');
                expect(actual.documentElement.localName).to.equal('AuthnRequest');
            });

            it('then it should set generic attributes', function() {
                const actual = _GetXmlDoc(authnRequest);

                expect(actual.documentElement.getAttribute('ID')).to.equal('6a5a3e52-9d3d-11e7-abc4-cec278b6b50a');
                expect(actual.documentElement.getAttribute('IssueInstant')).to.equal('2017-09-12T19:36:42Z');
                expect(actual.documentElement.getAttribute('Destination')).to.equal('http://auth.server');
                expect(actual.documentElement.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', 'Issuer')[0].childNodes[0].data).to.equal('http://entity.id');
            });

            it('then it should set Authn attributes', function() {
                const actual = _GetXmlDoc(authnRequest);

                expect(actual.documentElement.getAttribute('AssertionConsumerServiceURL')).to.equal('http://proxy.url/saml/response');
            })
        });

});


function _GetXmlDoc(request) {
    const actual = request.toXmlString();
    const xml = Buffer.from(actual, 'base64').toString();
    return new DOMParser().parseFromString(xml);
}