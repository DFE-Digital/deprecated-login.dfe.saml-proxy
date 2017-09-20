const Buffer = require('buffer').Buffer;
const DOMParser = require('xmldom').DOMParser;

const SamlPNS = 'urn:oasis:names:tc:SAML:2.0:protocol';
const Saml2NS = 'urn:oasis:names:tc:SAML:2.0:assertion';

class SamlResponse {

  static parse(encodedSamlResponse) {
    const xml = Buffer.from(encodedSamlResponse, 'base64').toString();
    const doc = new DOMParser().parseFromString(xml);

    return new SamlResponse();
  }

}

module.exports = SamlResponse;