const { v4 } = require('uuid');

function newUuid(lowerCase = true, includeHyphens = false) {
  let uuid = v4();
  if (!lowerCase) {
    uuid = uuid.toUpperCase();
  }
  if (!includeHyphens) {
    while (uuid.indexOf('-') > -1) {
      uuid = uuid.replace(/-/, '');
    }
  }
  return uuid;
}

module.exports = newUuid;
