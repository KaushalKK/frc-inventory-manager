"use strict";

var rootModule = angular.module('inventorySystem', [
    'ui.router'
]);

rootModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
                templateUrl: 'templates/cases.html'
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
                templateUrl: 'templates/products.html'
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