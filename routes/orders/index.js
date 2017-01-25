"use strict";
var q = require("q");

module.exports = function (router, passport, db) {
	return {
		"configureRoutes": function () {
			var resource = "/order";

			router.put(resource, passport.authenticate("jwt", { session: false }), function (req, res) {
				var orderDetails = new db.models.Orders(req.body);

				orderDetails.save()
					.then(function (orderDetails) {
						res.status(201).send({ message: orderDetails });
					})
					.catch(function (err) {
						res.status(400).send({ error: 'Failed to create order.' });
					});
			});

			router.get(resource + "s", passport.authenticate("jwt", { session: false }), function (req, res) {
				db.models.Orders.find({}).exec()
					.then(function (allOrders) {
						res.send({ message: allOrders });
					})
					.catch(function (err) {
						res.status(400).send({ error: 'Failed to get orders.' });
					});
			});

			router.get(resource + "/:orderId", passport.authenticate("jwt", { session: false }), function (req, res) {
				db.models.Orders.findOne({ barcode: req.params.orderId }).exec()
					.then(function (orderDetails) {
						res.send({ message: orderDetails });
					})
					.catch(function (err) {
						res.status(500).send({ error: 'Failed to get order information.' });
					})
			});

			router.post(resource + "/:orderId" + "/checkin", passport.authenticate("jwt", { session: false }), function (req, res) {
				db.models.Products.update({ barcode: req.params.orderId }, { $set: { caseId: req.body.caseId } }).exec()
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