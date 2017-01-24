"use strict";

angular.module('inventorySystem').directive('products', ['inventoryService', 'toastr', function (inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/products.html',
        replace: true,
        link: function (scope) {
            scope.productCountDropdown = [
                { label: '10', value: '10' },
                { label: '25', value: '25' }
            ];
            scope.products = [];

            scope.getProducts = function () {
                inventoryService.getAllProducts()
                    .then(function (data) {
                        scope.products = data;
                    })
                    .catch(function () {
                        scope.products = [];
                        toastr.error('Failed to get Products');
                    });
            };

            function init() {
                scope.productCount = scope.productCountDropdown[0];
                scope.search = '';

                scope.status = '';
                scope.productId = '';
                scope.productCost = '';
                scope.productName = '';
                scope.productQuantity = 0;
                scope.productCategory = '';
                scope.productDescription = '';

                scope.caseId = '';
                scope.productsInCase = 0;

                scope.getProducts();
            }

            init();
        }
    };
}]);