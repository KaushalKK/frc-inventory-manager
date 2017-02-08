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
                                    $scope.productOrders = asset.associatedContent || [];
                                    $scope.productsInCase = asset.associatedContent || [];

                                    $scope.closeDetailsModal = function () {
                                        $uibModalInstance.close();
                                    };

                                    $uibModalInstance.result.then(function () {
                                        setTimeout(function () {
                                            scope.getRecentOrders();
                                        }, 400);
                                    }, function () {
                                        setTimeout(function () {
                                            scope.getRecentOrders();
                                        }, 400);
                                    });
                                }]
                            });
                        })
                        .catch(function () {
                            toastr.error('Failed to get case details.');
                        });
                }
            };

            function init() {
                scope.getRecentOrders();
                scope.assetTagSearch = "";
            }

            init();
        }
    };
}]);