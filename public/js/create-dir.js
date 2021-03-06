"use strict";

angular.module('inventorySystem').directive('create', ['inventoryService', 'toastr', function (inventoryService, toastr) {
	return {
		restrict: 'AE',
		templateUrl: '../templates/create.html',
		replace: true,
		link: function (scope) {
			scope.typeDropdown = [
				{ name: "Case", value: "case" },
				{ name: "Produt", value: "product" },
				{ name: "Tote / Bin", value: "tote" }
			];
			scope.assetCopy = false;

			function init() {
				scope.assetTag = "";
				scope.itemName = "";
				scope.description = "";
				scope.type = scope.typeDropdown[0];

				scope.caseNumber = "";
				scope.itemInCase = "";
				scope.itemCountInCase = "";
			}

			scope.createItem = function () {
				var itemToSave = {
					name: scope.itemName,
					type: scope.type.value,
					assetTag: scope.assetTag,
					description: scope.description
				};

				if (scope.type.value === 'case') {
					itemToSave.caseNumber = scope.caseNumber;
				} else {
					itemToSave.inCase = {
						case: scope.itemInCase,
						quantity: scope.itemCountInCase,
						status: scope.itemInCase ? true : false
					};
				}

				inventoryService.createAsset(itemToSave)
					.then(function () {
						if (scope.assetCopy) {
							scope.assetTag = "";
						} else {
							init();
						}

						toastr.success('Case saved.');
					})
					.catch(function () {
						toastr.error('Failed to save case.');
					});
			};

			scope.cancel = function () {
				init();
			};

			init();
		}
	};
}]);