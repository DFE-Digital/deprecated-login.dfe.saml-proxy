const CacheProvider = require('./CacheProvider');
const LRU = require('lru-cache');

const storage = new LRU({});

class InMemoryCacheProvider extends CacheProvider {

  get(key) {
    return storage.get(key);
  }

  set(key, value) {
    storage.set(key, value);
  }

  remove(key) {
    storage.del(key);
  }

}

module.exports = InMemoryCacheProvider