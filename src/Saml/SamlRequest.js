const Buffer = require('buffer').Buffer;
const DOMParser = require('xmldom').DOMParser;
const XmlHelper = require('../Utils/XmlHelper');
const xmlParser = require('xml2js').parseString;

const SamlPNS = 'urn:oasis:names:tc:SAML:2.0:protocol';
const Saml2NS = 'urn:oasis:names:tc:SAML:2.0:assertion';

class SamlRequest {
  constructor(type, {id, issueInstant, destination, issuer, assertionConsumerServiceUrl}) {
    this.type = type;

    this.id = id;
    this.issueInstant = issueInstant;
    this.destination = destination;
    this.issuer = issuer;
    this.assertionConsumerServiceUrl = assertionConsumerServiceUrl;
  }

  validate(client) {
    let hasValidReturnUrl = false;
    client.returnUrls.forEach((returnUrl) => {
      if (this.assertionConsumerServiceUrl.toLowerCase().startsWith(returnUrl.toLowerCase())) {
        hasValidReturnUrl = true;
      }
    });
    if (!hasValidReturnUrl) {
      return false;
    }
    return true;
  }

  toXmlString() {
    var xml = `<saml2p:${this.type}Request xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" `
      + 'xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" '
      + `ID="${this.id}" `
      + 'Version="2.0" '
      + `IssueInstant="${XmlHelper.toXmlDateTimeString(this.issueInstant)}" `
      + `Destination="${this.destination}" `;

    if (this.type == 'Authn') {
      xml += `AssertionConsumerServiceURL="${this.assertionConsumerServiceUrl}" `
    }

    xml += '>';
    xml += `<saml2:Issuer>${this.issuer}</saml2:Issuer>`;
    xml += '</saml2p:AuthnRequest>';

    return new Buffer(xml).toString('base64');
  }

  static async parse(encodedSamlRequest) {
    const xml = Buffer.from(encodedSamlRequest, 'base64').toString();

    const doc = await _parseXml(xml);
    const request = doc[Object.keys(doc)[0]];
    const requestType = _parseRequestType(doc);
    const requestData = {
      id: request.$.ID,
      issueInstant: new Date(request.$.IssueInstant),
      destination: request.$.Destination,
      issuer: typeof request.Issuer[0] == 'string' ? request.Issuer[0] : request.Issuer[0]._
    };

    if (requestType == 'Authn') {
      requestData['assertionConsumerServiceUrl'] = request.$.AssertionConsumerServiceURL;
    }

    return new SamlRequest(requestType, requestData);
  }
}

module.exports = SamlRequest;


function _parseRequestType(doc) {
  let requestType = Object.keys(doc)[0];

  if (requestType.endsWith('Request')) {
    requestType = requestType.substring(0, requestType.length - 7);
  }

  return requestType;
}
function _parseXml(xml) {
  return new Promise((resolve) => {
    xmlParser(xml, {
      tagNameProcessors: [_stripPrefix]
    }, (err, result) => {
      resolve(result);
    });
  });
}

function _stripPrefix(name) {
  const match = name.match(/(.*)\:(.*)/);
  if (match && match.length > 1) {
    return match[2];
  }
  return name;
}