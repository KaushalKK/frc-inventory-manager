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

				if (order.status === 'checkin') {
					order.checkInTime = new Date();
				} else {
					order.checkInTime = null;
					order.checkOutTime = new Date();
				}

				assetModel.findOne({ assetTag: order.assetTag }).exec()
					.then((asset) => {
						order.productName = asset.name;

						return orderModel.findOneAndUpdate({ assetTag: order.assetTag, checkInTime: null }, order, { upsert: true }).exec();
					})
					.then((createdOrder) => {
						res.status(201).send({ message: createdOrder });
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
					searchQuery = req.query.searchTerm ? JSON.parse(req.query.searchTerm) : null;

				let condition = {};

				if (page === 'next') {
					condition.updatedAt = { $lt: offset };
				} else if (page === 'prev') {
					condition.updatedAt = { $gt: offset };
				}

				if (searchQuery !== null) {
					condition[Object.keys(searchQuery)[0]] = searchQuery[Object.keys(searchQuery)[0]];
					if (Object.keys(searchQuery)[0] === 'location') {
						condition.status = 'checkout';
						searchQuery.status = 'checkout';
					}
				} else {
					searchQuery = {};
				}

				orderModel.find(searchQuery).count().exec()
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