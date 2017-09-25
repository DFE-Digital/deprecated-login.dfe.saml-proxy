const clients = [
  {
    id: '470d8218-a230-11e7-abc4-cec278b6b50a',
    identifierUri: 'https://localhost:4432/470d8218-a230-11e7-abc4-cec278b6b50a',
    returnUrls: [
      'https://localhost:4432/'
    ]
  }
];

class StaticClientAdapter {
  get(identifierUri) {
    for(let i = 0; i < clients.length; i++){
      if(clients[i].identifierUri.toLowerCase() === identifierUri.toLowerCase()) {
        return clients[i];
      }
    }
    return null;
  }
  all() {
    return clients;
  }
}

module.exports = StaticClientAdapter;