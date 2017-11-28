const Config = require('./../Config');

const load = (id, includePrivateKey = false) => {
  const cert = Config.certificates[id];

  return {
    publicKey: cert.cert,
    privateKey: includePrivateKey ? cert.key : null,
  };
};

module.exports = {
  load,
};
