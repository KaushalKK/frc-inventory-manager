"use strict";

module.exports = function (mongoose, dbSchema) {

    dbSchema.asset.statics.findByCaseNumber = function (caseNumber) {
        return this.findOne({ caseNumber: caseNumber }).exec();
    };

    dbSchema.asset.statics.findByAssetTag = function (assetTag) {
        return this.findOne({ assetTag: assetTag }).exec();
    };

    dbSchema.asset.statics.findByAssetName = function (assetName) {
        return this.findOne({ name: assetName }).exec();
    };

    dbSchema.user.statics.findByUsername = function (username) {
        return this.findOne({ username: username }).exec();
    };

    var userModel = mongoose.model('Users', dbSchema.user);
    var assetModel = mongoose.model('Assets', dbSchema.asset);
    var orderModel = mongoose.model('Orders', dbSchema.order);

    return {
        users: userModel,
        asset: assetModel,
        orders: orderModel
    };
};