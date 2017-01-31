"use strict";

angular.module('inventorySystem').directive('products', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
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

            scope.getProductDetails = function (assetTag) {
                inventoryService.getAssetByTag(assetTag)
                    .then(function (asset) {
                        $uibModal.open({
                            templateUrl: '../templates/product-details.html',
                            size: 'lg',
                            windowClass: 'modal',
                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                $scope.edit = false;
                                $scope.details = asset.details;
                                $scope.productOrders = asset.associatedContent || [];

                                $scope.closeDetailsModal = function () {
                                    $uibModalInstance.close();
                                };

                                $scope.saveChanges = function () {
                                    var assetDetails = {
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
                    .catch(function (err) {
                        console.log(err);
                        toastr.error('Failed to get case details.');
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