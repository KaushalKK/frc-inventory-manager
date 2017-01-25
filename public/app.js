"use strict";

var rootModule = angular.module('inventorySystem', [
    'ngAnimate',
    'ngCookies',
    'toastr',
    'ui.bootstrap',
    'ui.router'
]);

rootModule.config(['$stateProvider', '$urlRouterProvider', 'toastrConfig', function ($stateProvider, $urlRouterProvider, toastrConfig) {

    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right',
        preventOpenDuplicates: true
    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('login', {
        url: '/login',
        views: {
            'header': {
                templateUrl: 'templates/header.html'
            },
            'left-nav': {
                template: [
                    '<aside class="main-sidebar">',
                        '<section class="sidebar">',
                        '</section>',
                    '</aside>'
                ].join()
            },
            'main': {
                template: '<div login></div>'
            }
        }
    });

    $stateProvider.state('home', {
        abstract: true,
        url: '/home',
        views: {
            'header': {
                templateUrl: 'templates/header.html',
                controller: function ($cookies, $scope, $state) {
                    $scope.isLoggedIn = $cookies.get('token').length > 0 ? true : false;

                    $scope.logout = function () {
                        $cookies.remove('token');
                        $state.go('login');
                    };
                }
            },
            'left-nav': {
                templateUrl: 'templates/left-navigation.html'
            },
            'main': {
                template: '<div ui-view></div>'
            }
        },
        resolve: {
            isLoggedIn: function checkLogin($cookies, $q, $state, $timeout) {
                var deferred = $q.defer();
                if ($cookies.get('token')) {
                    deferred.resolve();
                } else {
                    $timeout(function () {
                        $state.go('login');
                    });
                    deferred.reject('Not Authenticated.');
                }

                return deferred.promise;
            }
        }
    });

    $stateProvider.state('home.dashboard', {
        url: '/dashboard',
        views: {
            '@home': {
                templateUrl: 'templates/dashboard.html'
            }
        }
    });

    $stateProvider.state('home.cases', {
        url: '/cases',
        views: {
            '@home': {
                template: '<div cases></div>'
            }
        }
    });

    $stateProvider.state('home.products', {
        url: '/products',
        views: {
            '@home': {
                template: '<div products></div>'
            }
        }
    });

    $stateProvider.state('home.create', {
        url: '/create',
        views: {
            '@home': {
                template: '<div create></div>'
            }
        }
    });

    $stateProvider.state('home.orders', {
        url: '/orders',
        views: {
            '@home': {
                template: '<div orders></div>'
            }
        }
    });
}]);