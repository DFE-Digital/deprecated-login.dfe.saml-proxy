const LRU = require('lru-cache');

const storage = new LRU({});

const get = key => storage.get(key);

const set = (key, value) => {
  storage.set(key, value);
};

const remove = (key) => {
  storage.del(key);
};

module.exports = {
  get,
  set,
  remove,
};
