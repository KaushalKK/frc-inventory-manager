"use strict";

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/user";

            router.put(resource, function (req, res) {
                var userDetails = new db.models.Users(req.body);

                userDetails.save().exec()
                    .then(function (userDetails) {
                        res.status(201).send(userDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to create user.');
                    });
            });

            router.get(resource + "/:username", function (req, res) {
                db.models.Users.findByUsername(req.params.username)
                    .then(function (userDetails) {
                        res.send(userDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to get user information.');
                    });
            });
        }
    };
};