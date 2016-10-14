"use strict";

var mongoose = require('mongoose');

module.exports = function (dbConfig) {
    var options = { promiseLibrary: require('q') };
    var db = mongoose.connect(dbConfig, options);

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
}