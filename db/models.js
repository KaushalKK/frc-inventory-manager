"use strict";

module.exports = function (mongoose, dbSchema) {

    dbSchema.case.statics.findByCaseNumber = function (caseNumber) {
        return this.findOne({ number: caseNumber }).exec();
    };

    dbSchema.user.statics.findByUsername = function (username) {
        return this.findOne({ username: username }).exec();
    };

    var caseModel = mongoose.model('Cases', dbSchema.case);
    var userModel = mongoose.model('Users', dbSchema.user);
    var orderModel = mongoose.model('Orders', dbSchema.order);
    var productModel = mongoose.model('Products', dbSchema.product);

    return {
        cases: caseModel,
        users: userModel,
        orders: orderModel,
        products: productModel
    };
};