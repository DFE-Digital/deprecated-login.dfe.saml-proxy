const fs = require('fs');
const path = require('path');

const SamlResponse = require('./../../../src/Saml/SamlResponse');


const expectAsssertionToEqual = (assertion, expectedName, expectedValue) => {
  expect(assertion.name).toBe(expectedName);
  expect(assertion.value).toBe(expectedValue);
}

describe('When parsing an encoded SAML response', function() {

  describe('And the response is valid', function() {

    const testDataPath = path.resolve('./test/data/ValidSamlResponse.testdata.txt');
    const encodedSamlResponse = new Buffer(fs.readFileSync(testDataPath, 'utf8')).toString('base64');

    it('then it should return a SamlResponse', async function() {
      const actual = await SamlResponse.parse(encodedSamlResponse);

      expect(actual).not.toBeNull();
      expect(actual).toBeInstanceOf(SamlResponse);
    });

    it('then it should extract header information', async function () {
      const actual = await SamlResponse.parse(encodedSamlResponse);

      expect(actual.id).toBe('_c146a4b8-57a7-4451-87bd-97f2a33298ef');
      expect(actual.inResponseTo).toBe('_9434643bf16c4b45b04b7b29c45ec11c');
      expect(actual.destination).toBe('https://localhost:4432/saml/response');
      expect(actual.issuer).toBe('https://identifying.party/37c2dd70-7188-4743-a830-41936ecfbcab/');
      expect(actual.status).toBe('urn:oasis:names:tc:SAML:2.0:status:Success');
    });

    it('then it should extract assertions', async function() {
      const actual = await SamlResponse.parse(encodedSamlResponse);

      expect(actual.assertions.length).toBe(8);
      expectAsssertionToEqual(actual.assertions[0], 'http://schemas.microsoft.com/identity/claims/tenantid', '37c2dd70-7188-4743-a830-41936ecfbcab');
      expectAsssertionToEqual(actual.assertions[1], 'http://schemas.microsoft.com/identity/claims/objectidentifier', 'f3df26df-cb5f-427a-9ed4-df4d6b5de197');
      expectAsssertionToEqual(actual.assertions[2], 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname', 'Bull');
      expectAsssertionToEqual(actual.assertions[3], 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname', 'Simon');
      expectAsssertionToEqual(actual.assertions[4], 'http://schemas.microsoft.com/identity/claims/displayname', 'Simon Bull');
      expectAsssertionToEqual(actual.assertions[5], 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', 'Simon.Bull@unit.tests');
      expectAsssertionToEqual(actual.assertions[6], 'http://schemas.microsoft.com/identity/claims/identityprovider', 'https://identifying.party/37c2dd70-7188-4743-a830-41936ecfbcab/');
      expectAsssertionToEqual(actual.assertions[7], 'http://schemas.microsoft.com/claims/authnmethodsreferences', 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password');
    });

  });


});
