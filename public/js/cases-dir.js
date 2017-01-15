angular.module('inventorySystem').directive('cases', ['inventoryService', function (inventoryService) {
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
				scope.caseAssetTag = "";
				scope.caseNumber = "";
				scope.type = scope.typeDropdown[0];
				scope.quantity = "";
				scope.status = scope.statusOptions[0];
			}

			scope.saveCase = function () {
				var caseToSave = {

				};

				inventoryService.createCase()
					.then(function () {

					})
					.error(function () {
						console.log('Failed to save case');
					});
			}

			scope.cancel = function () {
				init();
			}

			scope.toggle = function () {
				if(scope.status === scope.statusOptions[0]) {
					scope.status = scope.statusOptions[1];
				} else {
					scope.status = scope.statusOptions[0];

				}
			}

			init();
		}
	}
}]);