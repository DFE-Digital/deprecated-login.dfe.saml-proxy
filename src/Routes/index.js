const SamlHandler = require('../Saml/SamlHandler');

class Routes {
    static register(app) {
        SamlHandler.register(app);

        app.get('/', function(req, res) {
            res.send('Hi there');
        });
    }
}

module.exports = Routes;