"use strict";

angular.module('inventorySystem').directive('cases', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/cases.html',
        replace: true,
        link: function (scope) {
            scope.caseCountDropdown = [
                { label: '10', value: '10' },
                { label: '25', value: '25' }
            ];
            scope.cases = [];

            scope.getCases = function () {
                inventoryService.getAllCases()
                    .then(function (data) {
                        scope.cases = data;
                    })
                    .catch(function () {
                        scope.cases = [];
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
                                $scope.details = asset.details;
                                $scope.productsInCase = asset.associatedContent || [];

                                $scope.closeDetailsModal = function() {
                                    $uibModalInstance.close();
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
                    .catch(function (err) {
                        console.log(err);
                        toastr.error('Failed to get case details.');
                    });
            };

            function init() {
                scope.caseCount = scope.caseCountDropdown[0];
                scope.search = '';

                scope.getCases();
            }

            init();
        }
    };
}]);