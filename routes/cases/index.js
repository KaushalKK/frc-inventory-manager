"use strict";
var q = require("q");

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/case";

            router.get(resource + '/:caseNumber', function (req, res) {
                db.models.Cases.findByCaseNumber(req.params.caseNumber)
                    .then(function (caseDetails) {
                        res.send(caseDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to get case');
                    });
            });

            router.post(resource, function (req, res) {
                var caseDetails = new db.models.Cases(req.body);

                caseDetails.save()
                    .then(function (caseDetails) {
                        res.status(201).send(caseDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to create case');
                    });
            });
        }
    };
};