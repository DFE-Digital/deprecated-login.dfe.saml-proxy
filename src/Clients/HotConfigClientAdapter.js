const ClientAdapter = require('./ClientAdapter');
const Config = require('./../Config');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');

class HotConfigClientAdapter extends ClientAdapter {
  async get(identifierUri) {
    const clients = await _all();
    for(let i = 0; i < clients.length; i++){
      if(clients[i].identifierUri.toLowerCase() === identifierUri.toLowerCase()) {
        return clients[i];
      }
    }
    return null;
  }
}

module.exports = HotConfigClientAdapter;


async function _all() {
  const options = {
    uri: Config.hotConfig.url + '/samlclients',
    headers:{
      authorization: `bearer ${Config.hotConfig.token}`
    }
  };

  if(Config.hostingEnvironment.env == 'dev') {
    options.strictSSL = false;
  }

  const json = await request(options);
  const clients = JSON.parse(json);
  return clients;
}