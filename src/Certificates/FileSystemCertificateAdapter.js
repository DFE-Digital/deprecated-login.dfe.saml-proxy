const path = require('path');
const fs = require('fs');

class FileSystemCertificateAdapter {
  constructor(dir) {
    this.dir = dir;
  }

  load(id, includePrivateKey = false) {
    const publicKeyPath = path.resolve(this.dir, id + '.cert');
    if (!fs.existsSync(publicKeyPath)) {
      throw new Error(`Cannot find certificate ${id}`);
    }

    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    let privateKey = null;

    if (includePrivateKey) {
      const privateKeyPath = path.resolve(this.dir, id + '.key');
      if (!fs.existsSync(privateKeyPath)) {
        throw new Error(`Cannot find certificate ${id}`);
      }
      privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    }

    return {
      publicKey: publicKey,
      privateKey: privateKey
    };
  }
}

module.exports = FileSystemCertificateAdapter;