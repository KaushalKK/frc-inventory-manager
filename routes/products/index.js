"use strict";
var q = require("q");

module.exports = function (router, passport, db) {
    return {
        "configureRoutes": function () {
            var resource = "/product";

            router.put(resource, passport.authenticate("jwt", { session: false }), function (req, res) {
                var productDetails = new db.models.Products(req.body);

                productDetails.save()
                    .then(function (productDetails) {
                        res.status(201).send({ message: productDetails });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to create product.' });
                    });
            });

            router.get(resource + "s", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Products.find({}).exec()
                    .then(function (allProducts) {
                        res.send({ message: allProducts });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to get products.' });
                    });
            });

            router.get(resource + "/:productBarcode", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Products.findOne({ barcode: req.params.productBarcode }).exec()
                    .then(function (productDetails) {
                        res.send({ message: productDetails });
                    })
                    .catch(function (err) {
                        res.status(500).send({ error: 'Failed to get product information.' });
                    })
            });

            router.post(resource + "/:productBarcode" + "/assign", passport.authenticate("jwt", { session: false }), function (req, res) {
                db.models.Products.update({ barcode: req.params.productBarcode }, { $set: { caseId: req.body.caseId } }).exec()
                    .then(function (userDetails) {
                        res.status(201).send({ message: 'Product successfully assigned to case.' });
                    })
                    .catch(function (err) {
                        res.status(400).send({ error: 'Failed to assign product to case.' });
                    });
            });
        }
    };
};