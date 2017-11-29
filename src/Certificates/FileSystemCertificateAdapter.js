const path = require('path');
const fs = require('fs');
const Config = require('./../Config');


const load = (id, includePrivateKey = false) => {
  const publicKeyPath = path.resolve(Config.certificates.storageRoot, `${id}.cert`);
  if (!fs.existsSync(publicKeyPath)) {
    throw new Error(`Cannot find certificate ${id}`);
  }

  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  let privateKey = null;

  if (includePrivateKey) {
    const privateKeyPath = path.resolve(Config.certificates.storageRoot, `${id}.key`);
    if (!fs.existsSync(privateKeyPath)) {
      throw new Error(`Cannot find certificate ${id}`);
    }
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  }

  return {
    publicKey,
    privateKey,
  };
};

module.exports = {
  load,
};
