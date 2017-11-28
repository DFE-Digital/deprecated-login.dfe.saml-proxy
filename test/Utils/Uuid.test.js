const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const uuidStubValue = '79da58a4-9d37-11e7-abc4-cec278b6b50a';
const uuidStub = function () {
  return uuidStubValue;
};

describe('when producing a new uuid', () => {
  let uuid;

  beforeEach(() => {
    uuid = proxyquire('./../../src/Utils/Uuid', { 'uuid/v4': uuidStub });
  });

  it('then it should return uuid', () => {
    const actual = uuid(true, true);

    expect(actual.toLowerCase()).to.equal(uuidStubValue.toLowerCase());
  });

  it('then it should return lower case uuid when lowerCase true', () => {
    const actual = uuid(true, true);

    expect(actual).to.equal(uuidStubValue.toLowerCase());
  });

  it('then it should return upper case uuid when lowerCase false', () => {
    const actual = uuid(false, true);

    expect(actual).to.equal(uuidStubValue.toUpperCase());
  });

  it('then it should return uuid with hyphens when includeHyphens true', () => {
    const actual = uuid(true, true);

    expect(actual).to.equal(uuidStubValue);
  });

  it('then it should return uuid with hyphens when includeHyphens false', () => {
    const actual = uuid(true, false);

    expect(actual).to.equal('79da58a49d3711e7abc4cec278b6b50a');
  });

  it('then it should return uuid in lower case with no hyphens when no parameters provided', () => {
    const actual = uuid();

    expect(actual).to.equal('79da58a49d3711e7abc4cec278b6b50a');
  });
});
