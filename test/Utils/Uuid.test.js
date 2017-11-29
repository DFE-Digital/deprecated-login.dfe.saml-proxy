const uuidStubValue = '79da58a4-9d37-11e7-abc4-cec278b6b50a';

jest.mock('uuid', () => {
  return {
    v4: () => '79da58a4-9d37-11e7-abc4-cec278b6b50a',
  };
});

describe('when producing a new uuid', () => {
  let uuid;

  beforeEach(() => {
    uuid = require('./../../src/Utils/Uuid');
  });

  it('then it should return uuid', () => {
    const actual = uuid(true, true);

    expect(actual.toLowerCase()).toBe(uuidStubValue.toLowerCase());
  });

  it('then it should return lower case uuid when lowerCase true', () => {
    const actual = uuid(true, true);

    expect(actual).toBe(uuidStubValue.toLowerCase());
  });

  it('then it should return upper case uuid when lowerCase false', () => {
    const actual = uuid(false, true);

    expect(actual).toBe(uuidStubValue.toUpperCase());
  });

  it('then it should return uuid with hyphens when includeHyphens true', () => {
    const actual = uuid(true, true);

    expect(actual).toBe(uuidStubValue);
  });

  it('then it should return uuid with hyphens when includeHyphens false', () => {
    const actual = uuid(true, false);

    expect(actual).toBe('79da58a49d3711e7abc4cec278b6b50a');
  });

  it('then it should return uuid in lower case with no hyphens when no parameters provided', () => {
    const actual = uuid();

    expect(actual).toBe('79da58a49d3711e7abc4cec278b6b50a');
  });
});
