"use strict";

module.exports = (router, passport, db) => {
	return {
		"configureRoutes": () => {
			let pageLimit = 10;
			let resource = "/order";
			let assetModel = db.models.Assets;
			let orderModel = db.models.Orders;

			router.put(resource, passport.authenticate("jwt", { session: false }), (req, res) => {
				var order = req.body;
				order.user = req.user.username;

				assetModel.findOne({ assetTag: order.assetTag }).exec()
					.then((asset) => {
						order.productName = asset.name;
						var orderDetails = new orderModel(order);

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
				let resp = {
					data: [],
					first: {},
					last: {},
					count: 0
				};

				let page = req.query.page,
					offset = req.query.offset,
					searchQuery = req.query.searchTerm || null;

				let condition = {};

				if (page === 'next') {
					condition.updatedAt = { $lt: offset };
				} else if (page === 'prev') {
					condition.updatedAt = { $gt: offset };
				}
console.log(searchQuery);
				if (searchQuery !== null) {
console.log('here');
console.log(Object.keys(searchQuery)[0]);
					condition[Object.keys(searchQuery)[0]] = searchQuery[Object.keys(searchQuery)[0]];
				}
console.log(searchQuery);
console.log(condition);
				orderModel.find({}).count().exec()
					.then((orderCount) => {
						resp.count = orderCount;
						return orderModel.find(condition).sort({ updatedAt: -1 }).limit(pageLimit).exec();
					})
					.then((allOrders) => {
						resp.data = allOrders;
						resp.first = allOrders[0];
						resp.last = allOrders[allOrders.length - 1];
						res.send({ message: resp });
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