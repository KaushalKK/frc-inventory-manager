"use strict";

angular.module("inventorySystem").directive('login', ['inventoryService', '$cookies', '$state', function (inventoryService, $cookies, $state) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '../templates/login.html',
        link: function (scope) {
            function init() {
                scope.username = '';
                scope.password = '';
                scope.showError = false;
            }

            scope.attemptLogin = function () {
                var user = {
                    username: scope.username,
                    password: scope.password
                };

                inventoryService.attemptLogin(user)
                    .then(function (loginResp) {
                        if (loginResp.token) {
                            scope.showError = false;
                            $cookies.put('token', loginResp.token);
                            $state.go('home');
                        } else {
                            scope.showError = true;
                        }
                    })
                    .catch(function () {
                        scope.showError = true;
                    })
            };

            init();
        }
    };
}]);