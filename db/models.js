"use strict";

module.exports = function (mongoose, dbSchema) {

    /* EXAMPLE of Custom DB Method */
    dbSchema.case.statics.findByCaseNumber = function (caseNumber) {
        return this.findOne({ number: caseNumber });
    };
    /* END EXAMPLE */

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