[![Build Status](https://travis-ci.org/DFE-Digital/login.dfe.saml-proxy.svg?branch=master)](https://travis-ci.org/DFE-Digital/login.dfe.saml-proxy)

# login.dfe.saml-proxy

SAML Proxy, to act as both a pass-through for other SAML endpoints and also bridge between SAML and OIDC. Part of the **login.dfe** project.

## Getting Started

Install deps
```
npm i
```

Setup Keystore & devlopment ssl certs
```
npm run setup
```

Run
```
npm run dev 
```

Visit
```
https://localhost:4433/
```

## Setting up with authenticating server

When connecting to an external SAML IDP, you will need to add the public key. This can usually be taken from the metadata endpoint for the IDP. The certificate then needs storing in /ssl/[ClientId].cert.
