"use strict";

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var fs = require('fs');

module.exports = function (router, db) {
    var cert = fs.readFileSync("keys/id_rsa");
    return {
        "configureRoutes": function () {
            var resource = "/user";

            router.put(resource, function (req, res) {
                var userDetails = new db.models.Users(req.body);

                userDetails.save()
                    .then(function (userDetails) {
                        res.status(201).send({ message: userDetails });
                    })
                    .catch(function () {
                        res.status(400).send({ error: 'Failed to create user.' });
                    });
            });

            router.get(resource + "/login", function (req, res) {
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
                            jwt.sign(payload, cert, options, function (token) {
                                res.cookie("token", token);
                                return res.status(200).send({ token: token });
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