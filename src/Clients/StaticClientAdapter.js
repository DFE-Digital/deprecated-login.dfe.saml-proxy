const clients = [
  {
    id: '470d8218-a230-11e7-abc4-cec278b6b50a',
    identifierUri: 'https://localhost:4432/470d8218-a230-11e7-abc4-cec278b6b50a',
    returnUrls: [
      'https://localhost:4432/',
    ],
    publicKeyId: '470d8218-a230-11e7-abc4-cec278b6b50a',
  },
];

const get = async (identifierUri) => {
  for (let i = 0; i < clients.length; i += 1) {
    if (clients[i].identifierUri.toLowerCase() === identifierUri.toLowerCase()) {
      return Promise.resolve(clients[i]);
    }
  }
  return Promise.resolve(null);
};

module.exports = {
  get,
};
