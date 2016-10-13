"use strict";
var q = require("q");

module.exports = function (router, db) {
    return {
        "configureRoutes": function () {
            var resource = "/product";

            router.put(resource, function (req, res) {
                var productDetails = new db.models.Products(req.body);

                productDetails.save().exec()
                    .then(function (productDetails) {
                        res.status(201).send(productDetails);
                    })
                    .catch(function (err) {
                        res.status(400).send('Failed to create product.');
                    });
            });

            router.get(resource + "/:productId", function (req, res) {
                res.status(501).send('Not Implemented.');
            });

            router.post(resource + "/:productId" + "/assign", function(req, res) {
                res.status(501).send('Not Implemented.');
            });
        }
    };
};