"use strict";

var express = require('express');

module.exports = function (config) {
    var router = express.Router();
    var db = require('../db/index.js')(config.dbConfig);

    var userResource = require('./users');

    var caseResource = require('./cases');
    var productResource = require('./products');

    userResource(router, db).configureRoutes();
    caseResource(router, db).configureRoutes();
    productResource(router, db).configureRoutes();

    return router;
};
