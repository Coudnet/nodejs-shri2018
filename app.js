const http = require('http');
const express = require('express');
const app = express();

const port = 8000;

app.set('port', port);
let server = http.createServer(app);
server.listen(port);

let apiRoute = require('./routes/api');
let statusRoute = require('./routes/status');

app.use(express.json());
app.use(express.urlencoded());

app.use('/api', apiRoute);
app.use('/status', statusRoute);

app.use(function(req, res) {
    res.status(404).send('<h1>Page not found</h1>');
});

module.exports = app;
