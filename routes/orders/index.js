"use strict";

module.exports = function (router, passport, db) {
	return {
		"configureRoutes": function () {
			var resource = "/order";

			router.put(resource, passport.authenticate("jwt", { session: false }), function (req, res) {
				var order = req.body;
				order.user = req.user.username;

				db.models.Assets.findOne({ assetTag: order.assetTag }).exec()
					.then(function (asset) {
						order.productName = asset.name;
						var orderDetails = new db.models.Orders(order);

						return orderDetails.save(orderDetails);
					})
					.then(function (createdOrderDetails) {
						res.status(201).send({ message: createdOrderDetails });
					})
					.catch(function (err) {
						res.status(400).send({
							error: 'Failed to create order.',
							details: err.toString()
						});
					});
			});

			router.get(resource + "s", passport.authenticate("jwt", { session: false }), function (req, res) {
				db.models.Orders.find({}).exec()
					.then(function (allOrders) {
						res.send({ message: allOrders });
					})
					.catch(function (err) {
						res.status(400).send({
							error: 'Failed to get orders.',
							details: err.toString()
						});
					});
			});

			router.get(resource + "/:orderId", passport.authenticate("jwt", { session: false }), function (req, res) {
				db.models.Orders.findOne({ barcode: req.params.orderId }).exec()
					.then(function (orderDetails) {
						res.send({ message: orderDetails });
					})
					.catch(function (err) {
						res.status(400).send({
							error: 'Failed to get order information.',
							details: err.toString()
						});
					});
			});
		}
	};
};