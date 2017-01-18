"use strict";

var fs = require('fs');
var express = require('express');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function (config) {
    var router = express.Router();
    var db = require('../db/index.js')(config.dbConfig);

    // Passport setup
    var opts = {};
    opts.issuer = "canfrc";
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = fs.readFileSync('keys/rsakey.pem');

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        done(null, jwt_payload);
    }));

    var userResource = require('./users');

    var caseResource = require('./cases');
    var productResource = require('./products');

    userResource(router, passport, db).configureRoutes();
    caseResource(router, passport, db).configureRoutes();
    productResource(router, passport, db).configureRoutes();

    return router;
};
