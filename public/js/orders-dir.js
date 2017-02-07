"use strict";

angular.module('inventorySystem').directive('orders', ['$uibModal', 'inventoryService', 'toastr', function ($uibModal, inventoryService, toastr) {
    return {
        restrict: 'AE',
        templateUrl: '../templates/orders.html',
        replace: true,
        link: function (scope) {
            scope.ordersCountDropdown = [
                { label: '10', value: '10' },
                { label: '25', value: '25' }
            ];
            scope.orders = [];

            scope.getOrders = function () {
                inventoryService.getAllOrders()
                    .then(function (response) {
                        scope.orders = response.data;
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
                scope.ordersCount = scope.ordersCountDropdown[0];
                scope.orderSearchTerm = '';

                scope.getOrders();
            }

            init();
        }
    };
}]);