"use strict";

let fs = require('fs');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

module.exports = (router, passport, db) => {
    let cert = fs.readFileSync("keys/rsa");
    return {
        "configureRoutes": () => {
            let resource = "/user";
            let model = db.models.Users;

            router.put(resource, (req, res) => {
                var user = {
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, 10),
                    email: req.body.email,
                    status: req.body.status || 'inactive'
                };
                var userDetails = new model(user);

                userDetails.save()
                    .then((userDetails) => {
                        res.status(201).send({ message: userDetails });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to create user.',
                            details: err.toString()
                        });
                    });
            });

            router.post(resource + "/login", (req, res) => {
                var payload = {
                    "username": req.body.username,
                };
                var options = {
                    "algorithm": "HS256",
                    "expiresIn": "3D",
                    "issuer": "canfrc"
                };

                model.findByUsername(req.body.username)
                    .then((userDetails) => {
                        var userLoginResult = bcrypt.compareSync(req.body.password, userDetails.password);
                        if (userLoginResult) {
                            jwt.sign(payload, cert, options, (err, token) => {
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
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to login.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
                model.findByUsername(req.params.username)
                    .then((userDetails) => {
                        res.status(200).send({ message: userDetails });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get user information.',
                            details: err.toString()
                        });
                    });
            });
        }
    };
};