"use strict";

angular.module('inventorySystem').directive('dashboard', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/dashboard.html',
        replace: true,
        link: function (scope) {

            scope.getRecentOrders = function () {
                inventoryService.getAllOrders(null, null)
                    .then(function (response) {
                        if (response.data.length > 0 && response.count > 0) {
                            scope.orders = response.data;
                            scope.tableError = false;
                        } else {
                            scope.tableError = true;
                            scope.errorText = "No Recent Orders in System";
                        }
                    })
                    .catch(function () {
                        scope.orders = [];
                        scope.tableError = true;
                        scope.errorText = "Failed to get Recent Orders";                        
                        toastr.error('Failed to get Recent Orders');
                    });
            };

            scope.assetSearch = function () {
                if (scope.assetTagSearch.length > 0 && scope.assetTagSearch !== '') {
                    inventoryService.getAssetByTag(scope.assetTagSearch)
                        .then(function (asset) {
                            $uibModal.open({
                                templateUrl: '../templates/asset-details.html',
                                size: 'lg',
                                windowClass: 'modal',
                                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                    $scope.details = asset.details;
                                    $scope.productOrders = asset.associatedOrders || [];
                                    $scope.productsInCase = asset.associatedProducts || [];

                                    $scope.closeDetailsModal = function () {
                                        $uibModalInstance.close();
                                    };

                                    $uibModalInstance.result.then(function () {
                                        setTimeout(function () {
                                            scope.assetTagSearch = "";
                                            scope.getRecentOrders();
                                        }, 400);
                                    }, function () {
                                        setTimeout(function () {
                                            scope.assetTagSearch = "";
                                            scope.getRecentOrders();
                                        }, 400);
                                    });
                                }]
                            });
                        })
                        .catch(function () {
                            toastr.error('Failed to get asset details.');
                        });
                }
            };

            function init() {
                scope.orders = [];
                scope.getRecentOrders();
                scope.tableError = false;
                scope.assetTagSearch = "";
                scope.errorText = "Failed to get Recent Orders";
            }

            init();
        }
    };
}]);