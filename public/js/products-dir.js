"use strict";

angular.module('inventorySystem').directive('products', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/products.html',
        replace: true,
        link: function (scope) {
            var last = null,
                first = null;

            scope.getProducts = function () {
                inventoryService.getAllProducts(null, null)
                    .then(function (response) {
                        if (response.data.length > 0 && response.count > 0) {
                            scope.products = response.data;
                            scope.pagination.page = 1;
                            scope.pagination.total = response.count;
                            last = response.last.updatedAt;
                            first = response.first.updatedAt;
                            scope.tableError = false;
                        } else {
                            scope.tableError = true;
                            scope.errorText = 'No Products in System';
                        }
                    })
                    .catch(function () {
                        scope.products = [];
                        scope.tableError = true;
                        scope.errorText = 'Failed to get Products';
                        toastr.error('Failed to get Products');
                    });
            };

            scope.getPage = function () {
                var nextPage = scope.pagination.page > scope.pagination.prevPage ? true : false;
                inventoryService.getAllProducts(nextPage ? 'next' : 'prev', nextPage ? last : first)
                    .then(function (response) {
                        if (response.data.length > 0 && response.count > 0) {
                            scope.products = response.data;
                            scope.pagination.page = 1;
                            scope.pagination.total = response.count;
                            last = response.last.updatedAt;
                            first = response.first.updatedAt;
                            scope.tableError = false;
                        } else {
                            scope.tableError = true;
                            scope.errorText = 'No Products in System';
                        }
                    })
                    .catch(function () {
                        scope.products = [];
                        scope.tableError = true;
                        scope.errorText = 'Failed to get Products';
                        toastr.error('Failed to get Products');
                    });
            };

            scope.getProductDetails = function (assetTag) {
                inventoryService.getAssetByTag(assetTag)
                    .then(function (asset) {
                        $uibModal.open({
                            templateUrl: '../templates/product-details.html',
                            size: 'lg',
                            windowClass: 'modal',
                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                $scope.edit = false;
                                $scope.noOrders = false;
                                $scope.details = asset.details;
                                $scope.productOrders = asset.associatedOrders || [];

                                if (asset.associatedOrders.length === 0) {
                                    $scope.noOrders = true;
                                }

                                $scope.closeDetailsModal = function () {
                                    $uibModalInstance.close();
                                };

                                $scope.saveChanges = function () {
                                    var assetDetails = {
                                        type: 'product',
                                        assetTag: assetTag,
                                        name: $scope.details.name,
                                        description: $scope.details.description,
                                        inCase: {
                                            case: $scope.details.inCase.case,
                                            quantity: $scope.details.inCase.quantity,
                                            status: $scope.details.inCase.case ? true : false
                                        }
                                    };

                                    inventoryService.editAsset(assetTag, assetDetails)
                                        .then(function () {
                                            $scope.edit = false;
                                        })
                                        .catch(function () {
                                            toastr.warning('Product Edit Failed', {
                                                timeOut: 500
                                            });
                                        });
                                };

                                $uibModalInstance.result.then(function () {
                                    setTimeout(function () {
                                        scope.getProducts();
                                    }, 400);
                                }, function () {
                                    setTimeout(function () {
                                        scope.getProducts();
                                    }, 400);
                                });
                            }]
                        });
                    })
                    .catch(function () {
                        toastr.error('Failed to get case details.');
                    });
            };

            function init() {
                scope.search = '';
                scope.products = [];
                scope.tableError = false;
                scope.errorText = 'Failed to get Products';
                scope.pagination = {
                    page: 1,
                    size: 0,
                    total: 0,
                    prevPage: 1,
                    totalPages: 0
                };

                scope.getProducts();
            }

            init();
        }
    };
}]);