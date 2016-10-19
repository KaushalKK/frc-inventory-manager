"use strict";

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/case";

            router.put(resource, function (req, res) {
                var caseDetails = new db.models.Cases(req.body);

                caseDetails.save()
                    .then(function (caseDetails) {
                        res.status(201).send({
                            message: caseDetails
                        });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to create case.' });
                    });
            });

            router.get(resource + "s", function (req, res) {
                db.models.Cases.find({}).exec()
                    .then(function (allCases) {
                        res.send({
                            message: allCases
                        });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get cases.' });
                    });
            });

            router.get(resource + "/:caseNumber", function (req, res) {
                db.models.Cases.findByCaseNumber(req.params.caseNumber)
                    .then(function (caseDetails) {
                        res.send({
                            message: caseDetails
                        });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get case.' });
                    });
            });

            router.post(resource + "/:caseNumber", function (req, res) {
                db.models.Cases.update({ number: req.params.caseNumber }, req.body, { overwrite: true }).exec()
                    .then(function (updatedCaseDetails) {
                        res.status(200).send({ message: 'Case ' + req.params.caseNumber + ' details updated.' });
                    })
                    .catch(function (err) {
                        res.status(500).send({ error: 'Failed to update Case ' + req.params.caseNumber + ' details.' });
                    });
            });

            router.post(resource + "/:caseNumber" + "/checkin", function (req, res) {
                db.models.Cases.update({ number: req.params.caseNumber }, { $set: { location: 'home' } }).exec()
                    .then(function (updatedCaseDetails) {
                        res.status(200).send({ message: 'Case ' + req.params.caseNumber + ' check in confirmed.' });
                    })
                    .catch(function (err) {
                        res.status(500).send({ error: 'Failed to check in case.' });
                    });
            });

            router.post(resource + "/:caseNumber" + "/checkout", function (req, res) {
                db.models.Cases.update({ number: req.params.caseNumber }, { $set: { location: req.body.event } }).exec()
                    .then(function (updatedCaseDetails) {
                        res.status(200).send({ message: 'Case ' + req.params.caseNumber + ' check out confirmed.' });
                    })
                    .catch(function (err) {
                        res.status(500).send({ error: 'Failed to check out case.' });
                    });
            });

            router.get(resource + "/:caseNumber" + "/products", function (req, res) {
                db.models.Cases.findByCaseNumber(req.params.caseNumber)
                    .then(function (caseDetails) {
                        return db.models.Products.find({ caseId: caseDetails._id }).exec();
                    })
                    .then(function (productsInCase) {
                        res.send({
                            message: productsInCase
                        });
                    })
                    .catch(function (err) {
                        res.status(500).send({ error: 'Failed to get products in case ' + req.params.caseNumber + '.' });
                    })
            });
        }
    };
};