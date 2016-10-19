"use strict";

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/user";

            router.put(resource, function (req, res) {
                var userDetails = new db.models.Users(req.body);

                userDetails.save()
                    .then(function (userDetails) {
                        res.status(201).send({ message: userDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to create user.' });
                    });
            });

            router.get(resource + "/:username", function (req, res) {
                db.models.Users.findByUsername(req.params.username)
                    .then(function (userDetails) {
                        res.send({ message: userDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get user information.' });
                    });
            });
        }
    };
};