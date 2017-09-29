const Buffer = require('buffer').Buffer;
const expect = require('chai').expect;

const SamlRequest = require('./../../../src/Saml/SamlRequest');

describe('When parsing a valid request', function() {

    describe('that is an AuthnRequest', function() {
        const validAuthnRequest = new Buffer('<saml2p:AuthnRequest xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" \n' +
            '                     xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" \n' +
            '                     ID="idf6a91730cfe0410791224c3ff6e7281e" \n' +
            '                     Version="2.0" \n' +
            '                     IssueInstant="2017-09-18T06:45:24Z" \n' +
            '                     Destination="http://localhost:8472/Saml" \n' +
            '                     AssertionConsumerServiceURL="http://localhost:6948/AuthServices/Acs">\n' +
            '  <saml2:Issuer>https://localhost:3941/1232190a</saml2:Issuer>\n' +
            '</saml2p:AuthnRequest>').toString('base64');

        it('then it should return an instance of SamlRequest that has type Authn', async function() {
            const actual = await SamlRequest.parse(validAuthnRequest);

            expect(actual).to.not.be.null;
            expect(actual).to.be.an('object');
            expect(actual).to.have.property('type');

            expect(actual.type).to.equal('Authn');
        });

        it('then it should parse generic properties from request', async function() {
            const actual = await SamlRequest.parse(validAuthnRequest);

            expect(actual.id).to.equal('idf6a91730cfe0410791224c3ff6e7281e');
            expect(actual.destination).to.equal('http://localhost:8472/Saml');
            expect(actual.issuer).to.equal('https://localhost:3941/1232190a');

            expect(actual.issueInstant.getUTCFullYear()).to.equal(2017);
            expect(actual.issueInstant.getUTCMonth()).to.equal(8);
            expect(actual.issueInstant.getUTCDate()).to.equal(18);
            expect(actual.issueInstant.getUTCHours()).to.equal(6);
            expect(actual.issueInstant.getUTCMinutes()).to.equal(45);
            expect(actual.issueInstant.getUTCSeconds()).to.equal(24);
        });

        it('then it should parse specific Authn properties from request', async function() {
            const actual = await SamlRequest.parse(validAuthnRequest);

            expect(actual.assertionConsumerServiceUrl).to.equal('http://localhost:6948/AuthServices/Acs');
        });
    });


});