'use strict';

const express = require('express');
const uuid = require('./../Utils/Uuid');
const SamlRequest = require('./../Saml/SamlRequest');
const Config = require('./../Config')

const router = express.Router({mergeParams: true});

module.exports = () => {
  router.get('/', (req, res) => {
    const serverBaseUrl = `${Config.hostingEnvironment.protocol}://${Config.hostingEnvironment.host}:${Config.hostingEnvironment.port}`;
    const samlRequest = new SamlRequest('Authn', {
      id: uuid(),
      issueInstant: new Date(),
      destination: `${serverBaseUrl}/saml`,
      issuer: `${serverBaseUrl}/dev/samlresponse`,
      assertionConsumerServiceUrl: `${serverBaseUrl}/dev/samlresponse`
    });

    res.render('dev/launchPad', {
      auth: {
        destination:`${serverBaseUrl}/saml`,
        samlRequest: samlRequest.toXmlString(),
        relayState: uuid()
      }
    });
  });

  router.post('/dev/samlresponse', (req, res) => {
    res.render('dev/samlresponse', {
      samlResponse: req.body.SAMLResponse,
      relayState: req.body.RelayState
    });
  });

  return router;

};