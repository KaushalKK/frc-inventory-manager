"use strict";

var express = require('express');
var passport = require('passport');

module.exports = function (config) {
    var router = express.Router();
    var db = require('../db/index.js')(config.dbConfig);

    var userResource = require('./users');

    var caseResource = require('./cases');
    var orderResource = require('./orders');
    var productResource = require('./products');

    userResource(router, passport, db).configureRoutes();
    caseResource(router, passport, db).configureRoutes();
    orderResource(router, passport, db).configureRoutes();
    productResource(router, passport, db).configureRoutes();

    return router;
};
