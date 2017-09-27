class ClientAdapter {
  constructor() {
    if (new.target === ClientAdapter) {
      throw new TypeError("Cannot construct ClientAdapter instances directly");
    }
  }

  async get(identifierUri) {
    return Promise.resolve(null);
  }
}

module.exports = ClientAdapter;