"use strict";

angular.module('inventorySystem').directive('orders', ['inventoryService', 'toastr', function (inventoryService, toastr) {
	return {
		restrict: 'AE',
		templateUrl: '../templates/orders.html',
		replace: true,
		link: function (scope) {
			scope.ordersCountDropdown = [
                { label: '10', value: '10' },
                { label: '25', value: '25' }
            ];
            scope.orders = [];

            scope.getOrders = function () {
                inventoryService.getAllOrders()
                    .then(function (data) {
                        scope.orders = data;
                    })
                    .catch(function () {
                        scope.orders = [];
                        toastr.error('Failed to get Orders');
                    });
            };

            function init() {
                scope.ordersCount = scope.ordersCountDropdown[0];
                scope.search = '';

                scope.getOrders();
            }

			init();
		}
	}
}]);