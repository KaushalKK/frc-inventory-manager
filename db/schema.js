"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
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

    var caseSchema = new Schema({
        assetTag: {
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

    var productSchema = new Schema({
        assetTag: {
            type: String,
            required: true
        },
        name: String,
        price: Number,
        status: String,
        category: String,
        quantity: Number,
        description: String,
        caseNumber: Number,
        caseQuantity: Number
    },
    {
        timestamps: true
    });

    var orderSchema = new Schema({
        user: String,
        status: String,
        assetTag: String,
        location: String,
        productName: String
    },
    {
        timestamps: true
    });

    return {
        case: caseSchema,
        user: userSchema,
        order: orderSchema,
        product: productSchema
    };
};