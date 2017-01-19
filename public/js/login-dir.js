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
                        var token = loginResp.token;
                        if (token) {
                            scope.showError = false;
                            $cookies.put('token', token);
                            $state.go('home.dashboard');
                        } else {
                            scope.showError = true;
                        }
                    })
                    .catch(function () {
                        scope.showError = true;
                    });
            };

            init();
        }
    };
}]);