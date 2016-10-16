"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var caseSchema = new Schema({
        number: {
            type: Number,
            unique: true
        },
        category: String,
        location: String,
        description: String
    });

    var userSchema = new Schema({
        username: {
            type: String,
            unique: true
        },
        email: String,
        password: String
    });

    var checkInSchema = new Schema({
        date: Date,
        caseId: ObjectId,
        userId: ObjectId,
        productId: ObjectId
    });

    var productSchema = new Schema({
        name: String,
        price: Number,
        caseId: ObjectId,
        status: String,
        category: String,
        quantity: Number,
        description: String,
        caseQuantity: Number
    });

    var checkOutSchema = new Schema({
        date: Date,
        caseId: ObjectId,
        userId: ObjectId,
        productId: ObjectId
    });


    return {
        case: caseSchema,
        user: userSchema,
        checkIn: checkInSchema,
        product: productSchema,
        checkOut: checkOutSchema
    };
};