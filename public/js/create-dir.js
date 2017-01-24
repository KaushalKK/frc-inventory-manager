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
			scope.statusOptions = ["Storage", "At Event"];

			function init() {
				scope.assetTag = "";
				scope.description = "";
				scope.type = scope.typeDropdown[0];
				scope.status = scope.statusOptions[0];

				scope.caseNumber = "";
				scope.itemName = "";
				scope.itemPrice = "";
				scope.itemQuantity = "";
				scope.itemInCase = "";
				scope.itemCountInCase = "";
			}

			scope.createItem = function () {
				var itemToSave = {
					location: scope.status,
					assetTag: scope.assetTag,
					category: scope.type.value,
					description: scope.description
				};

				if (scope.type.value === 'case' || scope.type.value === 'tote') {
					itemToSave.number = scope.caseNumber;

					inventoryService.createCase(itemToSave)
						.then(function () {
							init();
							toastr.success('Case saved.');
						})
						.catch(function () {
							toastr.error('Failed to save case.');
						});
				} else {
					itemToSave.name = scope.itemName;
					itemToSave.price = scope.itemPrice;
					itemToSave.quantity = scope.itemQuantity;

					itemToSave.caseId = scope.itemInCase;
					itemToSave.caseQuantity = scope.itemCountInCase;

					inventoryService.createProduct(itemToSave)
						.then(function () {
							init();
							toastr.success('Case saved.');
						})
						.catch(function () {
							toastr.error('Failed to save case.');
						});
				}
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
	};
}]);