"use strict";

angular.module('inventorySystem').directive('orders', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/orders.html',
        replace: true,
        link: function (scope) {
            var last = null,
                first = null;

            scope.pagination = {
                page: 1,
                size: 0,
                total: 0,
                prevPage: 1,
                totalPages: 0
            };
            scope.orders = [];
            scope.orderSearchOptions = [
                { label: 'Status', value: 'status' },
                { label: 'Location', value: 'location' }
            ];
            scope.locations = [
                { label: 'FIRST Canada Warehouse', value: 'warehouse' },
                { label: 'Durham', value: 'durham' },
                { label: 'Ryerson', value: 'ryerson' },
                { label: 'Victoria Park', value: 'vicpark' },
                { label: 'Waterloo', value: 'waterloo' },
                { label: 'Georgian', value: 'georgian' },
                { label: 'Windsor', value: 'windsor' },
                { label: 'Western', value: 'western' },
                { label: 'North Bay', value: 'northbay' },
                { label: 'McMaster', value: 'mac' },
                { label: 'District Championship', value: 'districtcmp' }
            ];
            scope.statusTypes = [
                 { label: 'Check In', value: 'checkin' },
                 { label: 'Check Out', value: 'checkout' }
            ];

            scope.getOrders = function () {
                inventoryService.getAllOrders(null, null, null)
                    .then(function (response) {
                        scope.orders = response.data;
                        scope.pagination.page = 1;
                        scope.pagination.total = response.count;
                        last = response.last.updatedAt;
                        first = response.first.updatedAt;
                    })
                    .catch(function () {
                        scope.orders = [];
                        toastr.error('Failed to get Orders');
                    });
            };

            scope.getPage = function () {
                var nextPage = scope.pagination.page > scope.pagination.prevPage ? true : false,
                    searchQuery = {
                        term: scope.orderSearchTerm,
                        field: scope.orderSearchType.value
                    };
                inventoryService.getAllOrders(nextPage ? 'next' : 'prev', nextPage ? last : first, searchQuery)
                    .then(function (response) {
                        scope.orders = response.data;
                        last = response.last.updatedAt;
                        first = response.first.updatedAt;
                        scope.pagination.prevPage = scope.pagination.page;
                    })
                    .catch(function () {
                        scope.orders = [];
                        toastr.error('Failed to get Orders');
                    });
            };

            scope.changeStatus = function (statusType) {
                $uibModal.open({
                    templateUrl: '../templates/' + statusType + '.html',
                    size: 'lg',
                    windowClass: 'modal',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.districtEvents = [
                            { label: 'Durham', value: 'durham' },
                            { label: 'Ryerson', value: 'ryerson' },
                            { label: 'Victoria Park', value: 'vicpark' },
                            { label: 'Waterloo', value: 'waterloo' },
                            { label: 'Georgian', value: 'georgian' },
                            { label: 'Windsor', value: 'windsor' },
                            { label: 'Western', value: 'western' },
                            { label: 'North Bay', value: 'northbay' },
                            { label: 'McMaster', value: 'mac' },
                            { label: 'District Championship', value: 'districtcmp' }
                        ];
                        $scope.warehouse = { label: 'FIRST Canada Warehouse', value: 'warehouse' };
                        $scope.successButtonText = (statusType === 'checkin' ? 'Check In' : 'Check Out');
                        $scope.closeModal = function () {
                            $uibModalInstance.dismiss('Cancel');
                            scope.getOrders();
                        };
                        $scope.submitOrder = function () {
                            var orderDetails = {
                                status: statusType,
                                assetTag: $scope.assetTag,
                                location: statusType === 'checkin' ? 'warehouse' : $scope.location.value
                            };

                            inventoryService.createOrder(orderDetails)
                                .then(function () {
                                    $uibModalInstance.close('Order Submitted');
                                })
                                .catch(function () {
                                    toastr.warning('Cancelled Check ' + (statusType === 'checkin' ? 'In ' : 'Out'), {
                                        timeOut: 500
                                    });
                                });
                        };
                        $uibModalInstance.result.then(function () {
                            setTimeout(function () {
                                scope.getOrders();
                            }, 400);
                        }, function () {
                            setTimeout(function () {
                                scope.getOrders();
                                toastr.warning('Cancelled Check ' + (statusType === 'checkin' ? 'In ' : 'Out'), {
                                    timeOut: 500
                                });
                            }, 400);
                        });
                    }]
                });
            };

            scope.assignSearchType = function (searchType) {
                scope.orderSearchType = searchType;
            };

            scope.orderSearch = function () {
                var searchQuery = {};
                if (scope.orderSearchTerm !== null) {
                    searchQuery[scope.orderSearchType.value] = scope.orderSearchTerm.value;
                } else {
                    searchQuery = null;
                }
                inventoryService.getAllOrders(null, null, searchQuery)
                    .then(function (response) {
                        scope.orders = response.data;
                        last = response.last.updatedAt;
                        first = response.first.updatedAt;
                        scope.pagination.prevPage = scope.pagination.page;
                    })
                    .catch(function () {
                        scope.orders = [];
                        toastr.error('Failed to find Orders matching search query');
                    });
            };

            function init() {
                scope.orderSearchTerm = '';
                scope.orderSearchType = scope.orderSearchOptions[0];

                scope.getOrders();
            }

            init();
        }
    };
}]);