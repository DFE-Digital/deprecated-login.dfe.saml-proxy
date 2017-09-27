const ClientAdapter = require('./ClientAdapter');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');

class HotConfigClientAdapter extends ClientAdapter {
  constructor(url, token, env) {
    super();
    this.url = url;
    this.token = token;
    this.env = env;
  }

  async get(identifierUri) {
    const clients = await _all(this.url, this.token, this.env);
    for(let i = 0; i < clients.length; i++){
      if(clients[i].identifierUri.toLowerCase() === identifierUri.toLowerCase()) {
        return clients[i];
      }
    }
    return null;
  }
}

module.exports = HotConfigClientAdapter;


async function _all(url, token, env) {
  const options = {
    uri: url + '/samlclients',
    headers:{
      authorization: `bearer ${token}`
    }
  };

  if(env == 'dev') {
    options['agentOptions'] = {
      ca: fs.readFileSync(path.resolve('./ssl/hotconfig.cert'))
    };
  }

  const json = await request(options);
  const clients = JSON.parse(json);
  return clients;
}