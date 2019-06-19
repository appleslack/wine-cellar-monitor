const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require( './util/database').mongoConnect;
const serverConfig = require('./util/config');

const app = express();

// JSON data only
app.use( bodyParser.json() );

// Allow Headers for CORS:
app.use((req, res, next) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*');
    res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

// Routing
const readingsRoutes = require( './routes/readings');
app.use( '/readings', readingsRoutes);

mongoConnect( () => {
    console.log('Connected in app.js!');
});

app.listen(serverConfig.PORT);
