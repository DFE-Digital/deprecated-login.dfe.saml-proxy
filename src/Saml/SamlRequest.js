const Buffer = require('buffer').Buffer;
const DOMParser = require('xmldom').DOMParser;

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

    toXmlString() {
        var xml = `<saml2p:${this.type}Request xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" `
                + 'xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" '
                + `ID="${this.id}" `
                + 'Version="2.0" '
                + `IssueInstant="${_toXmlDateTimeString(this.issueInstant)}" `
                + `Destination="${this.destination}" `;

        if (this.type == 'Authn') {
            xml += `AssertionConsumerServiceURL="${this.assertionConsumerServiceUrl}" `
        }

        xml += '>';
        xml += `<saml2:Issuer>${this.issuer}</saml2:Issuer>`;
        xml += '</saml2p:AuthnRequest>';

        return new Buffer(xml).toString('base64');
    }

    static parse(encodedSamlRequest) {
        const xml = Buffer.from(encodedSamlRequest, 'base64').toString();
        const doc = new DOMParser().parseFromString(xml);

        const requestType = _parseRequestType(doc);
        const requestData = {
            id: doc.documentElement.getAttribute('ID'),
            issueInstant: new Date(doc.documentElement.getAttribute('IssueInstant')),
            destination: doc.documentElement.getAttribute('Destination'),
            issuer: doc.documentElement.getElementsByTagNameNS(Saml2NS, 'Issuer')[0].childNodes[0].data
        };

        if (requestType == 'Authn') {
            requestData['assertionConsumerServiceUrl'] = doc.documentElement.getAttribute('AssertionConsumerServiceURL');
        }

        return new SamlRequest(requestType, requestData);
    }
}

module.exports = SamlRequest;


function _parseRequestType(doc) {
    let requestType = doc.documentElement.localName;

    if (requestType.endsWith('Request')) {
        requestType = requestType.substring(0, requestType.length - 7);
    }

    return requestType;
}
function _toXmlDateTimeString(date) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hour = date.getUTCHours().toString().padStart(2, '0');
    const minute = date.getUTCMinutes().toString().padStart(2, '0');
    const second = date.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}