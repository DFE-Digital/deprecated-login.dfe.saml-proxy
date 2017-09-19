const uuidv4 = require('uuid/v4');

function newUuid(lowerCase = true, includeHyphens = false) {
    var uuid = uuidv4();
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