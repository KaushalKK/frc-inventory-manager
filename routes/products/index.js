"use strict";
var q = require("q");

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/product";

            router.put(resource, function (req, res) {
                var productDetails = new db.models.Products(req.body);

                productDetails.save()
                    .then(function (productDetails) {
                        res.status(201).send(productDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to create product.');
                    });
            });

            router.get(resource + "/all", function (req, res) {
                db.models.Products.find({}).exec()
                    .then(function (allProducts) {
                        res.send(allProducts);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to get products.');
                    });
            });

            router.get(resource + "/:productBarcode", function (req, res) {
                db.models.Products.findOne({ barcode: req.params.productBarcode }).exec()
                    .then(function (productDetails) {
                        res.send(productDetails);
                    })
                    .catch(function (err) {
                        res.status(500).send('Failed to get product information.');
                    })
            });

            router.post(resource + "/:productBarcode" + "/assign", function (req, res) {
                db.models.Products.update({ barcode: req.params.productBarcode }, { $set: { caseId: req.body.caseId } }).exec()
                    .then(function (userDetails) {
                        res.status(201).send('Product successfully assigned to case.');
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to assign product to case.');
                    });
            });
        }
    };
};