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

    /* Cases */
    this.getAllCases = function () {
        return promiseWrap($http({
            method: 'GET',
            url: '/cases',
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.getCaseByNumber = function (caseNumber) {
        return promiseWrap($http({
            method: 'GET',
            url: '/case/' + caseNumber,
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.getProductsInCase = function (caseNumber) {
        return promiseWrap($http({
            method: 'GET',
            url: '/case/' + caseNumber + '/products',
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.createCase = function (caseDetails) {
        return promiseWrap($http({
            method: 'PUT',
            url: '/case',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: caseDetails
        }));
    };

    this.updateCase = function (caseDetails) {
        return promiseWrap($http({
            method: 'POST',
            url: '/case/' + caseDetails.number,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: caseDetails
        }));
    };

    /* Products */
    this.getAllProducts = function () {
        return promiseWrap($http({
            method: 'GET',
            url: '/products',
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.getProductById = function (productId) {
        return promiseWrap($http({
            method: 'GET',
            url: '/product/' + productId,
            headers: {
                'Authorization': 'JWT ' + $cookies.get('token')
            }
        }));
    };

    this.createProduct = function (productDetails) {
        return promiseWrap($http({
            method: 'PUT',
            url: '/product',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: productDetails
        }));
    };

    this.addProductToCase = function (productId, caseId) {
        return promiseWrap($http({
            method: 'POST',
            url: '/product/' + productId + '/assign',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + $cookies.get('token')
            },
            data: {
                caseId: caseId
            }
        }));
    };

    /* Orders */
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
}]);