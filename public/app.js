"use strict";

var rootModule = angular.module('inventorySystem', [
    'ngAnimate',
    'toastr',
    'ui.router'
]);

rootModule.config(['$stateProvider', '$urlRouterProvider', 'toastrConfig', function ($stateProvider, $urlRouterProvider, toastrConfig) {

    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right',
        preventOpenDuplicates: true
    });

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        views: {
            'header': {
                templateUrl: 'templates/header.html'
            },
            'left-nav': {
                templateUrl: 'templates/left-navigation.html'
            },
            'main': {
                templateUrl: 'templates/dashboard.html'
            }
        }
    });

    $stateProvider.state('cases', {
        url: '/cases',
        views: {
            'header': {
                templateUrl: 'templates/header.html'
            },
            'left-nav': {
                templateUrl: 'templates/left-navigation.html'
            },
            'main': {
                template: '<div cases></div>'
            }
        }
    });

    $stateProvider.state('products', {
        url: '/products',
        views: {
            'header': {
                templateUrl: 'templates/header.html'
            },
            'left-nav': {
                templateUrl: 'templates/left-navigation.html'
            },
            'main': {
                template: '<div products></div>'
            }
        }
    });

    $stateProvider.state('new', {
        url: '/new',
        views: {
            'header': {
                templateUrl: 'templates/header.html'
            },
            'left-nav': {
                templateUrl: 'templates/left-navigation.html'
            },
            'main': {
                templateUrl: 'templates/new.html'
            }
        }
    });
}]);