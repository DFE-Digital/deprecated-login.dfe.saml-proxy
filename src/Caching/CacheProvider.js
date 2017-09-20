class CacheProvider {
  constructor() {
    if(new.target === CacheProvider) {
      throw new TypeError("Cannot construct CacheProvider instances directly");
    }
  }

  set(key, value){}
  get(key){return null;}
  remove(key){}
}

module.exports = CacheProvider;