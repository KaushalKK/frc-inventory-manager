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

            scope.getOrders = function () {
                inventoryService.getAllOrders(null, null)
                    .then(function (response) {
                        scope.orders = response.data;
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
                var nextPage = scope.pagination.page > scope.pagination.prevPage ? true : false;
                inventoryService.getAllOrders(nextPage ? 'next' : 'prev', nextPage ? last : first)
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

            function init() {
                scope.orderSearchTerm = '';

                scope.getOrders();
            }

            init();
        }
    };
}]);