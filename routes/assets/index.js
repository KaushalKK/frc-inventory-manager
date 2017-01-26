"use strict";

module.exports = function (router, passport, db) {
    return {
        "configureRoutes": function () {
            var resource = "/asset";
            var assetModel = db.models.Assets;

            router.put(resource, passport.authenticate("jwt", { session: false }), function (req, res) {
                var assetDetails = new assetModel(req.body);

                assetDetails.save()
                    .then(function (assetDetails) {
                        res.status(201).send({ message: assetDetails });
                    })
                    .catch(function () {
                        res.status(400).send({
                            error: 'Failed to create asset.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "s", passport.authenticate("jwt", { session: false }), function (req, res) {
                assetModel.find({}).exec()
                    .then(function (allAssets) {
                        res.send({ message: allAssets });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to get assets.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/cases", passport.authenticate("jwt", { session: false }), function (req, res) {
                assetModel.find({ $or: [{ type: 'case' }, { type: 'tote' }] }).exec()
                    .then(function (allCasesAndTotes) {
                        res.send({ message: allCasesAndTotes });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to get cases and totes.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/products", passport.authenticate("jwt", { session: false }), function (req, res) {
                assetModel.find({ type: 'product' }).exec()
                    .then(function (allProducts) {
                        res.send({ message: allProducts });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to get products.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/:assetTag", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Assets.findOne({ assetTag: req.params.assetTag }).exec()
                    .then(function (assetDetails) {
                        res.send({ message: assetDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to get asset information.',
                            details: err.toString()
                        });
                    });
            });

            router.post(resource + "/:assetTag" + "/assign", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Assets.update({ assetTag: req.params.assetTag }, { $set: { "inCase.status": true, "inCase.case": req.body.caseNumber, "inCase.quantity": req.body.quantity || 1 } }).exec()
                    .then(function (assetDetails) {
                        res.status(201).send({ message: assetDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({
                            error: 'Failed to assign asset to case.',
                            details: err.toString()
                        });
                    });
            });
        }
    };
};