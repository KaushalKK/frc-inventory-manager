"use strict";

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/case";

            router.put(resource, function (req, res) {
                var caseDetails = new db.models.Cases(req.body);

                caseDetails.save().exec()
                    .then(function (caseDetails) {
                        res.status(201).send(caseDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to create case.');
                    });
            });

            router.get(resource + "/:caseNumber", function (req, res) {
                db.models.Cases.findByCaseNumber(req.params.caseNumber)
                    .then(function (caseDetails) {
                        res.send(caseDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to get case');
                    });
            });

            router.post(resource + "/:caseNumber", function (req, res) {
                var caseDetails = new db.models.Cases(req.body);

                db.models.Cases.update({ number: req.params.caseNumber }, req.body, { overwrite: true }).exec()
                    .then(function (updatedCaseDetails) {
                        res.status(200).send('Case ' + req.params.caseNumber + ' details updated.');
                    })
                    .catch(function (err) {
                        res.status(500).send('Failed to update Case ' + req.params.caseNumber + ' details.');
                    });
            });
        }
    };
};