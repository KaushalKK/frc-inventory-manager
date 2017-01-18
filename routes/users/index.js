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
                    .catch(function () {
                        res.status(400).send({ error: 'Failed to create user.' });
                    });
            });

            router.post(resource + "/login", function (req, res) {
                var payload = {
                    "username": req.body.username,
                };
                var options = {
                    "algorithm": "RS256",
                    "expiresIn": "3D",
                    "issuer": "canfrc"
                };

                db.models.Users.findByUsername(req.body.username)
                    .then(function (userDetails) {
                        var userLoginResult = bcrypt.compareSync(req.body.password, userDetails.password);
                        if (userLoginResult) {
                            jwt.sign(payload, cert, options, function (err, token) {
                                if (err) {
                                    throw new Error('Failed to Login');
                                } else {
                                    res.cookie("token", token);
                                    res.status(200).send({ token: token });
                                }
                            });
                        } else {
                            throw new Error('Failed to Login');
                        }
                    })
                    .catch(function () {
                        res.status(400).send({ error: 'Failed to login.' });
                    });
            });

            router.get(resource + "/:username", function (req, res) {
                db.models.Users.findByUsername(req.params.username)
                    .then(function (userDetails) {
                        res.send({ message: userDetails });
                    })
                    .catch(function () {
                        res.status(400).send({ error: 'Failed to get user information.' });
                    });
            });
        }
    };
};