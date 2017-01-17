"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var caseSchema = new Schema({
        barcode: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            unique: true,
            required: true
        },
        category: String,
        location: String,
        description: String
    },
    {
        timestamps: true
    });

    var userSchema = new Schema({
        barcode: {
            type: String,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        email: String,
        status: String,
        password: String
    },
    {
        timestamps: true
    });

    var checkInSchema = new Schema({
        caseId: ObjectId,
        userId: ObjectId,
        productId: ObjectId
    },
    {
        timestamps: true
    });

    var productSchema = new Schema({
        barcode: {
            type: String,
            required: true
        },
        name: String,
        price: Number,
        status: String,
        category: String,
        quantity: Number,
        description: String,
        caseId: ObjectId,
        caseQuantity: Number
    },
    {
        timestamps: true
    });

    var checkOutSchema = new Schema({
        caseId: ObjectId,
        userId: ObjectId,
        productId: ObjectId,
        eventId: String
    },
    {
        timestamps: true
    });


    return {
        case: caseSchema,
        user: userSchema,
        checkIn: checkInSchema,
        product: productSchema,
        checkOut: checkOutSchema
    };
};