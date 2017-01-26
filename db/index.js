"use strict";

var mongoose = require('mongoose');

module.exports = function (dbConfig) {
    var options = {
        promiseLibrary: require('q'),
        server: { auto_reconnect: false },
        user: dbConfig.username,
        pass: new Buffer(dbConfig.password, 'base64').toString("ascii"),
        auth: {
            authMechanism: 'SCRAM-SHA-1',
            authSource: dbConfig.authDb
        }
    };
    var db = mongoose.connect(dbConfig.url, options);

    mongoose.Promise = require('q').Promise;

    var schema = require('./schema')(mongoose);
    var models = require('./models')(mongoose, schema);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        // we're connected!
        console.log("DB connected!");
    });

    process.on('SIGTERM', function () {
        setTimeout(function () {
            mongoose.close();
        }, 1000);
    });

    return db;
};