"use strict";

var fs = require('fs');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = function (router, passport, db) {
    var cert = fs.readFileSync("keys/rsa");
    return {
        "configureRoutes": function () {
            var resource = "/user";

            router.put(resource, function (req, res) {
                var user = {
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, 10),
                    email: req.body.email,
                    status: req.body.status || 'inactive'
                };
                var userDetails = new db.models.Users(user);

                userDetails.save()
                    .then(function (userDetails) {
                        res.status(201).send({ message: userDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to create user.',
                            details: err.toString()
                        });
                    });
            });

            router.post(resource + "/login", function (req, res) {
                var payload = {
                    "username": req.body.username,
                };
                var options = {
                    "algorithm": "HS256",
                    "expiresIn": "3D",
                    "issuer": "canfrc"
                };

                db.models.Users.findByUsername(req.body.username)
                    .then(function (userDetails) {
                        var userLoginResult = bcrypt.compareSync(req.body.password, userDetails.password);
                        if (userLoginResult) {
                            jwt.sign(payload, cert, options, function (err, token) {
                                if (err) {
                                    throw Error('Failed to Login');
                                } else {
                                    res.cookie("token", token);
                                    res.status(200).send({
                                        message: {
                                            token: token
                                        }
                                    });
                                }
                            });
                        } else {
                            throw Error('Failed to Login');
                        }
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to login.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/:username", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Users.findByUsername(req.params.username)
                    .then(function (userDetails) {
                        res.status(200).send({ message: userDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to get user information.',
                            details: err.toString()
                        });
                    });
            });
        }
    };
};