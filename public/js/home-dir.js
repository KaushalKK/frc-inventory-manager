"use strict";

angular.module('inventorySystem').directive('dashboard', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/dashboard.html',
        replace: true,
        link: function (scope) {
            scope.orders = [];

            scope.getRecentOrders = function () {
                inventoryService.getAllOrders(null, null)
                    .then(function (response) {
                        scope.orders = response.data;
                    })
                    .catch(function () {
                        scope.orders = [];
                        toastr.error('Failed to get recent Orders');
                    });
            };

            function init() {
                scope.getRecentOrders();
            }

            init();
        }
    };
}]);