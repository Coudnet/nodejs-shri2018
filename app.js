const express = require('express');
const app = express();

let apiRoute = require('./api');
let statusRoute = require('./status');

app.use(express.json());
app.use(express.urlencoded());

app.use('/api', apiRoute);
app.use('/status', statusRoute);

app.use(function(req, res) {
    res.status(404).send('<h1>Page not found</h1>');
    console.log(1);
});

module.exports = app;
