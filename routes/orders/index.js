"use strict";

module.exports = (router, passport, db) => {
	return {
		"configureRoutes": () => {
			let resource = "/order";
			let model = db.models.Orders;
			let assetModel = db.models.Assets;

			router.put(resource, passport.authenticate("jwt", { session: false }), (req, res) => {
				var order = req.body;
				order.user = req.user.username;

				assetModel.findOne({ assetTag: order.assetTag }).exec()
					.then((asset) => {
						order.productName = asset.name;
						var orderDetails = new model(order);

						return orderDetails.save(orderDetails);
					})
					.then((createdOrderDetails) => {
						res.status(201).send({ message: createdOrderDetails });
					})
					.catch((err) => {
						res.status(400).send({
							error: 'Failed to create order.',
							details: err.toString()
						});
					});
			});

			router.get(resource + "s", passport.authenticate("jwt", { session: false }), (req, res) => {
				model.find({}).exec()
					.then((allOrders) => {
						res.send({ message: allOrders });
					})
					.catch((err) => {
						res.status(400).send({
							error: 'Failed to get orders.',
							details: err.toString()
						});
					});
			});
		}
	};
};