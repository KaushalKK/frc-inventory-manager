"use strict";

angular.module('inventorySystem').service('inventoryService', ['$http', '$q', function ($http, $q) {
	var promiseWrap = function (request) {
		var deferred = $q.defer();

		request.then(function (response) {
			deferred.resolve(response.data.message);
		}, function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	this.getAllCases = function() {
        return promiseWrap($http({
            method: 'GET',
            url: '/cases'
        }));
    };

	this.getCaseByNumber = function(caseNumber) {
        return promiseWrap($http({
            method: 'GET',
            url: '/case/' + caseNumber
        }));
    };

	this.getProductsInCase = function(caseNumber) {
        return promiseWrap($http({
            method: 'GET',
            url: '/case/' + caseNumber + '/products'
        }));
    };

	this.createCase = function(caseDetails) {
        return promiseWrap($http({
            method: 'PUT',
            url: '/case',
            headers: {
                'Content-Type': 'application/json'
            },
            data: caseDetails
        }));
    };

	this.updateCase = function(caseDetails) {
        return promiseWrap($http({
            method: 'POST',
            url: '/case/' + caseDetails.number,
            headers: {
                'Content-Type': 'application/json'
            },
            data: caseDetails
        }));
    };

	this.checkinCase = function(caseNumber) {
        return promiseWrap($http({
            method: 'POST',
            url: '/case/' + caseNumber + '/checkin',
            headers: {
                'Content-Type': 'application/json'
            }
        }));
    };

	this.checkoutCase = function(caseNumber, eventCode) {
        return promiseWrap($http({
            method: 'POST',
            url: '/case/' + caseNumber + '/checkout',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
				event: eventCode	
			}
        }));
    };

	/* Products */
	this.getAllProducts = function() {
        return promiseWrap($http({
            method: 'GET',
            url: '/products'
        }));
    };
}]);