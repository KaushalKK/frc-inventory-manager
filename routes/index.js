var express = require('express');

module.exports = function (config) {
    var router = express.Router();
    var db = require('../db/index.js')(config.dbConfig);
    
    var caseResource = require('./cases');
    var productResource = require('./products');

    caseResource(router, db).configureRoutes();
    productResource(router, db).configureRoutes();

    return router;
};
