const express = require('express');
const fs = require('fs');

const app = express();


// Setup routes
app.get('/', function(req, res) {
    res.send('Hi there');
});


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