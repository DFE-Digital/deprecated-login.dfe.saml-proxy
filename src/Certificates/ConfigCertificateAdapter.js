const Config = require('./../Config');

class ConfigCertificateAdapter {
  load(id, includePrivateKey = false) {
    const cert = Config.certificates[id];

    return {
      publicKey: cert.cert,
      privateKey: includePrivateKey ? cert.key : null
    };
    // const publicKeyPath = path.resolve(Config.certificates.storageRoot, id + '.cert');
    // if (!fs.existsSync(publicKeyPath)) {
    //   throw new Error(`Cannot find certificate ${id}`);
    // }
    //
    // const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    // let privateKey = null;
    //
    // if (includePrivateKey) {
    //   const privateKeyPath = path.resolve(Config.certificates.storageRoot, id + '.key');
    //   if (!fs.existsSync(privateKeyPath)) {
    //     throw new Error(`Cannot find certificate ${id}`);
    //   }
    //   privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    // }
    //
    // return {
    //   publicKey: publicKey,
    //   privateKey: privateKey
    // };
  }
}

module.exports = ConfigCertificateAdapter;