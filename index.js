"use strict";

//libs
var http = require('http');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config.js')();
var routes = require('./routes/index')(config);

//server config
var app = express();
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', routes);
app.use(express.static('public'));

http.createServer(app).listen(app.get('port'), function () {
    console.log('FRC Inventory server listening on port ' + app.get('port'));
});