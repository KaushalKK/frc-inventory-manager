"use strict";

angular.module('inventorySystem').directive('cases', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/cases.html',
        replace: true,
        link: function (scope) {
            var last = null,
                first = null;

            scope.getCases = function () {
                inventoryService.getAllCases(null, null)
                    .then(function (response) {
                        if (response.data.length > 0 && response.count > 0) {
                            scope.cases = response.data;
                            scope.pagination.page = 1;
                            scope.pagination.total = response.count;
                            last = response.last.updatedAt;
                            first = response.first.updatedAt;
                            scope.tableError = false;
                        } else {
                            scope.tableError = true;
                            scope.errorText = 'No Cases in System';
                        }
                    })
                    .catch(function () {
                        scope.cases = [];
                        scope.tableError = true;
                        scope.errorText = 'Failed to get Cases';
                        toastr.error('Failed to get Cases');
                    });
            };

            scope.getPage = function () {
                var nextPage = scope.pagination.page > scope.pagination.prevPage ? true : false;
                inventoryService.getAllCases(nextPage ? 'next' : 'prev', nextPage ? last : first)
                    .then(function (response) {
                        if (response.data.length > 0 && response.count > 0) {
                            scope.cases = response.data;
                            scope.pagination.page = 1;
                            scope.pagination.total = response.count;
                            last = response.last.updatedAt;
                            first = response.first.updatedAt;
                            scope.tableError = false;
                        } else {
                            scope.tableError = true;
                            scope.errorText = 'No Cases in System';
                        }
                    })
                    .catch(function () {
                        scope.cases = [];
                        scope.tableError = true;
                        scope.errorText = 'Failed to get Cases';
                        toastr.error('Failed to get Cases');
                    });
            };

            scope.getCaseDetails = function (assetTag) {
                inventoryService.getAssetByTag(assetTag)
                    .then(function (asset) {
                        $uibModal.open({
                            templateUrl: '../templates/case-details.html',
                            size: 'lg',
                            windowClass: 'modal',
                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                $scope.edit = false;
                                $scope.noOrders = false;
                                $scope.noProducts = false;
                                $scope.details = asset.details;
                                $scope.caseOrders = asset.associatedOrders || [];
                                $scope.caseProducts = asset.associatedProducts || [];

                                if (asset.associatedOrders.length === 0) {
                                    $scope.noOrders = true;
                                }

                                if (asset.associatedProducts.length === 0) {
                                    $scope.noProducts = true;
                                }

                                $scope.closeDetailsModal = function () {
                                    $uibModalInstance.close();
                                };

                                $scope.saveChanges = function () {
                                    var assetDetails = {
                                        type: asset.type,
                                        assetTag: assetTag,
                                        name: $scope.details.name,
                                        caseNumber: asset.caseNumber,
                                        description: $scope.details.description
                                    };

                                    inventoryService.editAsset(assetTag, assetDetails)
                                        .then(function () {
                                            $scope.edit = false;
                                        })
                                        .catch(function () {
                                            toastr.warning((asset.type === 'case' ? 'Case' : 'Tote') + ' Edit Failed', {
                                                timeOut: 500
                                            });
                                        });
                                };

                                $uibModalInstance.result.then(function () {
                                    setTimeout(function () {
                                        scope.getCases();
                                    }, 400);
                                }, function () {
                                    setTimeout(function () {
                                        scope.getCases();
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
                scope.cases = [];
                scope.tableError = false;
                scope.errorText = 'Failed to get Cases';
                scope.pagination = {
                    page: 1,
                    size: 0,
                    total: 0,
                    prevPage: 1,
                    totalPages: 0
                };

                scope.getCases();
            }

            init();
        }
    };
}]);