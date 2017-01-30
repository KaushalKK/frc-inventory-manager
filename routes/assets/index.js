"use strict";

module.exports = (router, passport, db) => {
    return {
        "configureRoutes": () => {
            let resource = "/asset";
            let assetModel = db.models.Assets;
            let orderModel = db.models.Orders;

            router.put(resource, passport.authenticate("jwt", { session: false }), (req, res) => {
                var assetDetails = new assetModel(req.body);

                assetDetails.save()
                    .then((assetDetails) => {
                        res.status(201).send({ message: assetDetails });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to create asset.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "s", passport.authenticate("jwt", { session: false }), (req, res) => {
                assetModel.find({}).exec()
                    .then((allAssets) => {
                        res.send({ message: allAssets });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get assets.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/cases", passport.authenticate("jwt", { session: false }), (req, res) => {
                assetModel.find({ $or: [{ type: 'case' }, { type: 'tote' }] }).exec()
                    .then((allCasesAndTotes) => {
                        res.send({ message: allCasesAndTotes });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get cases and totes.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/products", passport.authenticate("jwt", { session: false }), (req, res) => {
                assetModel.find({ type: 'product' }).exec()
                    .then((allProducts) => {
                        res.send({ message: allProducts });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get products.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/:assetTag", passport.authenticate("jwt", { session: false }), (req, res) => {
                let assetResponse = {};

                assetModel.findOne({ assetTag: req.params.assetTag }).exec()
                    .then((assetDetails) => {
                        assetResponse.details = assetDetails;
                        return assetDetails.type !== 'product' ? assetModel.find({ 'inCase.case': assetDetails.caseNumber }).exec() : orderModel.find({ assetTag: req.params.assetTag }).exec();
                    })
                    .then(function (productsOrOrders) {
                        assetResponse.associatedContent = productsOrOrders;
                        res.send({ message: assetResponse });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get asset information.',
                            details: err.toString()
                        });
                    });
            });

            router.post(resource + "/:assetTag", passport.authenticate("jwt", { session: false }), (req, res) => {
                assetModel.findOneAndUpdate({ assetTag: req.params.assetTag }, req.body).exec()
                    .then((assetDetails) => {
                        res.status(200).send({ message: assetDetails });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to update asset.',
                            details: err.toString()
                        });
                    });
            });

            router.post(resource + "/:assetTag" + "/assign", passport.authenticate("jwt", { session: false }), (req, res) => {
                assetModel.update({ assetTag: req.params.assetTag }, { $set: { "inCase.status": true, "inCase.case": req.body.caseNumber, "inCase.quantity": req.body.quantity || 1 } }).exec()
                    .then((assetDetails) => {
                        res.status(201).send({ message: assetDetails });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to assign asset to case.',
                            details: err.toString()
                        });
                    });
            });
        }
    };
};