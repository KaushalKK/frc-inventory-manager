"use strict";

var express = require('express');
var passport = require('passport');

module.exports = function (config) {
    var router = express.Router();
    var db = require('../db/index.js')(config.dbConfig);

    var userResource = require('./users');

    var assetResource = require('./assets');
    var orderResource = require('./orders');

    userResource(router, passport, db).configureRoutes();
    assetResource(router, passport, db).configureRoutes();
    orderResource(router, passport, db).configureRoutes();

    return router;
};
