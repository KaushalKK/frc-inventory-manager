"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var caseSchema = new Schema({
        id: {
            type: ObjectId,
            unique: true
        },
        number: Number,
        category: String,
        location: String,
        description: String
    });
    
    var userSchema = new Schema({
        id: ObjectId,
        username: {
            type: String,
            unique: true
        },
        email: String,
        password: String
    });
    
    var checkInSchema = new Schema({
        id: {
            type: ObjectId,
            unique: true
        },
        date: Date,
        caseId: ObjectId,
        userId: ObjectId,
        productId: ObjectId
    });
    
    var productSchema = new Schema({
        id: {
            type: ObjectId,
            unique: true
        },
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
        id: {
            type: ObjectId,
            unique: true
        },
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