"use strict";
var q = require("q");

module.exports = function (router, passport, db) {
    return {
        "configureRoutes": function () {
            var resource = "/assets";
            var assetModel = db.models.Assets;

            router.put(resource, passport.authenticate("jwt", { session: false }), function (req, res) {
                var assetDetails = new assetModel(req.body);

                assetDetails.save()
                    .then(function (assetDetails) {
                        res.status(201).send({ message: assetDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to create asset.' });
                    });
            });

            router.get(resource + "s", passport.authenticate("jwt", { session: false }), function (req, res) {
                assetModel.find({}).exec()
                    .then(function (allAssets) {
                        res.send({ message: allAssets });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get cases and totes.' });
                    });
            });

            router.get(resource + "/cases", passport.authenticate("jwt", { session: false }), function (req, res) {
                assetModel.find({ $or: [{ type: 'case' }, { type: 'tote' }] }).exec()
                    .then(function (allCasesAndTotes) {
                        res.send({ message: allCasesAndTotes });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get cases and totes.' });
                    });
            });

            router.get(resource + "/products", passport.authenticate("jwt", { session: false }), function (req, res) {
                assetModel.find({ type: 'product' }).exec()
                    .then(function (allProducts) {
                        res.send({ message: allProducts });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get products.' });
                    });
            });

            router.get(resource + "/:assetTag", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Assets.findOne({ assetTag: req.params.assetTag }).exec()
                    .then(function (assetDetails) {
                        res.send({ message: assetDetails });
                    })
                    .catch(function (err) {
                        res.status(500).send({ error: 'Failed to get asset information.' });
                    })
            });

            /* Need to Fix asset assignment */
            router.post(resource + "/:assetTag" + "/assign", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Assets.update({ assetTag: req.params.assetTag }, { $set: { inCase: req.body.caseId } }).exec()
                    .then(function (userDetails) {
                        res.status(201).send({ message: 'Product successfully assigned to case.' });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to assign asset to case.' });
                    });
            });
        }
    };
};