const Config = require('./../Config');
const request = require('request-promise');

async function all() {
  const options = {
    uri: `${Config.hotConfig.url}/samlclients`,
    headers: {
      authorization: `bearer ${Config.hotConfig.token}`,
    },
  };

  if (Config.hostingEnvironment.env === 'dev') {
    options.strictSSL = false;
  }

  const json = await request(options);
  return JSON.parse(json);
}


const get = async (identifierUri) => {
  const clients = await all();
  for (let i = 0; i < clients.length; i += 1) {
    if (clients[i].identifierUri.toLowerCase() === identifierUri.toLowerCase()) {
      return clients[i];
    }
  }
  return null;
};

module.exports = {
  get,
};

