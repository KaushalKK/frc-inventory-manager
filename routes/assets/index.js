"use strict";

module.exports = (router, passport, db) => {
    return {
        "configureRoutes": () => {
            let pageLimit = 10;
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
                let resp = {
                    data: [],
                    first: {},
                    last: {},
                    count: 0
                };

                let page = req.query.page,
                    offset = req.query.offset;

                let condition = {};

                if (page === 'next') {
                    condition.updatedAt = { $lt: offset };
                } else if (page === 'prev') {
                    condition.updatedAt = { $gt: offset };
                }

                assetModel.count().exec()
                    .then(function (assetCount) {
                        resp.count = assetCount;
                        return assetModel.find(condition).limit(pageLimit).exec();
                    })
                    .then((allAssets) => {
                        resp.data = allAssets;
                        resp.first = allAssets[0];
                        resp.last = allAssets[allAssets.length - 1];
                        res.send({ message: resp });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get assets.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/cases", passport.authenticate("jwt", { session: false }), (req, res) => {
                let resp = {
                    data: [],
                    first: {},
                    last: {},
                    count: 0
                };

                let page = req.query.page,
                    offset = req.query.offset;

                let condition = { $or: [{ type: 'case' }, { type: 'tote' }] };

                if (page === 'next') {
                    condition.updatedAt = { $lt: offset };
                } else if (page === 'prev') {
                    condition.updatedAt = { $gt: offset };
                }

                assetModel.find({ $or: [{ type: 'case' }, { type: 'tote' }] }).count().exec()
                    .then(function (assetCount) {
                        resp.count = assetCount;
                        return assetModel.find(condition).sort({ updatedAt: -1 }).limit(pageLimit).exec();
                    })
                    .then((allCasesAndTotes) => {
                        resp.data = allCasesAndTotes;
                        resp.first = allCasesAndTotes[0];
                        resp.last = allCasesAndTotes[allCasesAndTotes.length - 1];
                        res.send({ message: resp });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            error: 'Failed to get cases and totes.',
                            details: err.toString()
                        });
                    });
            });

            router.get(resource + "/products", passport.authenticate("jwt", { session: false }), (req, res) => {
                let resp = {
                    data: [],
                    first: {},
                    last: {},
                    count: 0
                };

                let page = req.query.page,
                    offset = req.query.offset;

                let condition = { type: 'product' };

                if (page === 'next') {
                    condition.updatedAt = { $lt: offset };
                } else if (page === 'prev') {
                    condition.updatedAt = { $gt: offset };
                }

                assetModel.find({ type: 'product' }).count().exec()
                    .then(function (assetCount) {
                        resp.count = assetCount;
                        return assetModel.find(condition).sort({ updatedAt: -1 }).limit(pageLimit).exec();
                    })
                    .then((allProducts) => {
                        resp.data = allProducts;
                        resp.first = allProducts[0];
                        resp.last = allProducts[allProducts.length - 1];
                        res.send({ message: resp });
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
                    .then(() => {
                        res.status(200).send({ message: 'Asset Updated' });
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