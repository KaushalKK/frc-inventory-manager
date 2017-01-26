"use strict";

let express = require('express');
let passport = require('passport');

module.exports = (config) => {
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
