const Buffer = require('buffer').Buffer;
const DOMParser = require('xmldom').DOMParser;
const xmlParser = require('xml2js').parseString;
const xmlBuilder = require('xml2js').Builder;
const SignedXml = require('xml-crypto').SignedXml;
const select = require('xml-crypto').xpath;
const XmlHelper = require('../Utils/XmlHelper');

class SamlResponse {

  constructor({xml, id, inResponseTo, issueInstant, destination, issuer, status, assertions, sessionIndex, audience}) {
    this.xml = xml;
    this.id = id;
    this.inResponseTo = inResponseTo;
    this.issueInstant = issueInstant;
    this.destination = destination;
    this.issuer = issuer;
    this.status = status;
    this.assertions = assertions;
    this.sessionIndex = sessionIndex ? sessionIndex : ('_' + new Date().getTime());
    this.audience = audience;
  }

  verify(publicKey) {
    const doc = new DOMParser().parseFromString(this.xml);

    const signature = select(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];
    const sig = new SignedXml();
    sig.keyInfoProvider = new KeyInfo(publicKey);
    sig.loadSignature(signature);
    const res = sig.checkSignature(this.xml);

    return res;
  }
  toXmlString(privateKey) {
    const issueInstantString = XmlHelper.toXmlDateTimeString(this.issueInstant);

    const expiryInstant = new Date(this.issueInstant.getTime() + (60 * 60 * 1000));
    const expiryInstantString = XmlHelper.toXmlDateTimeString(expiryInstant);

    let attributes = [];
    if (this.assertions && this.assertions.length > 0) {
      this.assertions.forEach((item) => {
        attributes.push({
          '$': {
            'Name': item.name
          },
          'AttributeValue': item.value
        });
      })
    }

    const builder = new xmlBuilder();
    const unsignedXml = builder.buildObject({
      'samlp:Response': {
        '$': {
          'xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
          'ID': this.id,
          'Version': '2.0',
          'IssueInstant': issueInstantString,
          'Destination': this.destination,
          'InResponseTo': this.inResponseTo
        },
        'Issuer': {
          '$': {
            'xmlns': 'urn:oasis:names:tc:SAML:2.0:assertion'
          },
          '_': this.issuer
        },
        'samlp:Status': {
          'samlp:StatusCode': {
            '$': {
              'Value': this.status
            }
          }
        },
        'Assertion': {
          '$': {
            'xmlns': 'urn:oasis:names:tc:SAML:2.0:assertion',
            'ID': this.sessionIndex,
            'IssueInstant': issueInstantString,
            'Version': '2.0'
          },
          'Issuer': this.issuer,
          'Subject': {},
          'Conditions': {
            '$': {
              'NotBefore': issueInstantString,
              'NotOnOrAfter': expiryInstantString
            },
            'AudienceRestriction': {
              'Audience': this.audience
            }
          },
          'AttributeStatement': {
            'Attribute': attributes
          }
        }
      }
    });
    const signedXml = _makeSignedXml(unsignedXml, privateKey);

    return signedXml;
  }

  static async parse(encodedSamlResponse) {
    const xml = Buffer.from(encodedSamlResponse, 'base64').toString();

    const doc = await _parseXml(xml);
    const response = doc.Response;

    let assertions = [];
    response.Assertion[0].AttributeStatement[0].Attribute
      .forEach((samlAttr) => {
        assertions.push({
          name: samlAttr.$.Name,
          value: samlAttr.AttributeValue[0]
        });
      });

    return new SamlResponse({
      xml: xml,
      id: response.$.ID,
      inResponseTo: response.$.InResponseTo,
      issueInstant: new Date(response.$.IssueInstant),
      destination: response.$.Destination,
      issuer: response.Issuer[0]._,
      status: response.Status[0].StatusCode[0].$.Value,
      assertions: assertions
    });
  }

}

module.exports = SamlResponse;




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

function _makeSignedXml(unsignedXml, privateKey) {
  const sig = new SignedXml();
  sig.addReference('//*[local-name(.)="Assertion"]');
  sig.signingKey = privateKey;
  sig.computeSignature(unsignedXml, {
    location: {
      reference: '//*[local-name(.)="Assertion"]/*[local-name(.)="Issuer"]',
      action: 'after'
    }
  });
  return sig.getSignedXml();
}

function KeyInfo(publicKey) {
  this.getKey = function(keyInfo) {
    return publicKey;
  }
}