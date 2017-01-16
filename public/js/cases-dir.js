"use strict";

angular.module('inventorySystem').directive('cases', ['inventoryService', 'toastr', function (inventoryService, toastr) {
	return {
		restrict: 'AE',
		templateUrl: '../templates/cases.html',
		link: function (scope) {
			scope.typeDropdown = [
				{ name: "Case", value: "Case" },
				{ name: "Tote / Bin", value: "Tote / Bin" }
			];
			scope.statusOptions = ["Storage", "At Event"];

			function init() {
				scope.quantity = "";
				scope.caseNumber = "";
				scope.caseAssetTag = "";
				scope.caseDescription = "";
				scope.type = scope.typeDropdown[0];
				scope.status = scope.statusOptions[0];
			}

			scope.saveCase = function () {
				var caseToSave = {
					category: scope.type,
					number: scope.caseNumber,
					barcode: scope.caseAssetTag,
					location: scope.status.value,
					description: scope.caseDescription
				};

				inventoryService.createCase()
					.then(function () {
						toastr.success('Case saved.');
					})
					.catch(function () {
						toastr.error('Failed to save case.');
					});
			}

			scope.cancel = function () {
				init();
			}

			scope.toggle = function () {
				if (scope.status === scope.statusOptions[0]) {
					scope.status = scope.statusOptions[1];
				} else {
					scope.status = scope.statusOptions[0];

				}
			}

			init();
		}
	}
}]);