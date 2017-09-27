//const FileSystemCertificateAdapter = require('./../../../src/Certificates/FileSystemCertificateAdapter');

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const proxyquire = require('proxyquire');

describe('When loading a certificate', function () {

  let adapter;

  beforeEach(function () {
    const FileSystemCertificateAdapter = proxyquire('./../../../src/Certificates/FileSystemCertificateAdapter', {
      './../Config': {
        certificates: {
          storageRoot: path.resolve('./test/data/')
        }
      }
    });
    adapter = new FileSystemCertificateAdapter();
  });

  describe('that exists', function () {

    let expectedPublicKey;
    let expectedPrivateKey;

    beforeEach(function () {
      expectedPublicKey = fs.readFileSync('./test/data/test1.cert', 'utf8');
      expectedPrivateKey = fs.readFileSync('./test/data/test1.key', 'utf8');
    });

    it('then it should return the content of the .cert file as public key', function () {
      const actual = adapter.load('test1');

      expect(actual).to.not.be.null;
      expect(actual.publicKey).to.equal(expectedPublicKey)
    });

    it('then it should return a null private key if includePrivateKey is false', function () {
      const actual = adapter.load('test1');

      expect(actual).to.not.be.null;
      expect(actual.privateKey).to.be.null;
    });

    it('then it should return the content of the .key file as private key if includePrivateKey is true', function () {
      const actual = adapter.load('test1', true);

      expect(actual).to.not.be.null;
      expect(actual.privateKey).to.equal(expectedPrivateKey)
    });

  });

  describe('that does not exist', function () {

    it('then it should throw an Error if cert file missing', function () {
      const fn = () => {
        adapter.load('no-cert');
      };

      expect(fn).to.throw(Error, 'Cannot find certificate no-cert');
    });

    it('then it should throw an Error if key file missing and includePrivateKey', function () {
      const fn = () => {
        adapter.load('test2', true);
      };

      expect(fn).to.throw(Error, 'Cannot find certificate test2');
    });

    it('then it should not throw an error if key file is missing but includePrivateKey is false', function() {
      const fn = () => {
        adapter.load('test2');
      };

      expect(fn).to.not.throw(Error, 'Cannot find certificate test2');
    });

  });

});
