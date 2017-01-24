"use strict";

angular.module('inventorySystem').directive('cases', ['inventoryService', 'toastr', function (inventoryService, toastr) {
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

            function init() {
                scope.caseCount = scope.caseCountDropdown[0];
                scope.search = '';

                scope.getCases();
            }

			init();
		}
	}
}]);