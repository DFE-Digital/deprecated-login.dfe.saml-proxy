const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const routes = require('./Routes');

const app = express();

// Add middleware
app.use(bodyParser.urlencoded({extended: true}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// Setup routes
routes.register(app);

// Setup server
const host = process.env.HOST ? process.env.HOST : 'localhost';
const port = process.env.PORT ? process.env.PORT : 4432;

if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev') {
    app.proxy = true;

    const https = require('https');
    const options = {
        key: fs.readFileSync('./ssl/localhost.key'),
        cert: fs.readFileSync('./ssl/localhost.cert'),
        requestCert: false,
        rejectUnauthorized: false
    };
    const server = https.createServer(options, app);

    server.listen(port, function () {
        console.log(`Dev server listening on https://${host}:${port}`);
    })
} else {
    app.listen(port, function() {
        console.log(`Dev server listening on http://${host}:${port}`);
    });
}