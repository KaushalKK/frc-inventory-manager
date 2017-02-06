"use strict";

angular.module('inventorySystem').service('inventoryService', ['$cookies', '$http', '$q', function ($cookies, $http, $q) {
    var promiseWrap = function (request) {
        var deferred = $q.defer();

        request.then(function (response) {
            deferred.resolve(response.data.message);
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    /* Login */
    this.attemptLogin = function (loginDetails) {
        return promiseWrap($http({
            method: 'POST',
            url: '/user/login',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: loginDetails
        }));
    };

    /* Assets */
    this.createAsset = function (assetDetails) {
        return promiseWrap($http({
            method: 'PUT',
            url: '/asset',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: assetDetails
        }));
    };

    this.editAsset = function (assetTag, assetDetails) {
        return promiseWrap($http({
            method: 'POST',
            url: '/asset/' + assetTag,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: assetDetails
        }));
    };

    this.getAssetByTag = function (assetTag) {
        return promiseWrap($http({
            method: 'GET',
            url: '/asset/' + assetTag,
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    /* Cases */
    this.getAllCases = function (direction, updateAt) {
        var queryParams = {};
        if (direction !== null && updateAt !== null) {
            queryParams.page = direction;
            queryParams.offset = updateAt;
        }

        return promiseWrap($http({
            method: 'GET',
            url: '/asset/cases',
            params: queryParams,
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    /* Products */
    this.getAllProducts = function () {
        return promiseWrap($http({
            method: 'GET',
            url: '/asset/products',
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.addProductToCase = function (assetTag, caseNumber, quantity) {
        return promiseWrap($http({
            method: 'POST',
            url: '/asset/' + assetTag + '/assign',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: {
                caseNumber: caseNumber,
                quantity: quantity
            }
        }));
    };

    /* Orders */
    this.createOrder = function (orderDetails) {
        return promiseWrap($http({
            method: 'PUT',
            url: '/order',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: orderDetails
        }));
    };

    this.getAllOrders = function () {
        return promiseWrap($http({
            method: 'GET',
            url: '/orders',
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.getOrderById = function (orderId) {
        return promiseWrap($http({
            method: 'GET',
            url: '/order/' + orderId,
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };
}]);