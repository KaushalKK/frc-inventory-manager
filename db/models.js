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
    var checkInModel = mongoose.model('CheckIns', dbSchema.checkIn);
    var productModel = mongoose.model('Products', dbSchema.product);
    var checkOutModel = mongoose.model('CheckOuts', dbSchema.checkOut);

    return {
        cases: caseModel,
        users: userModel,
        checkIns: checkInModel,
        products: productModel,
        checkOuts: checkOutModel
    };
};