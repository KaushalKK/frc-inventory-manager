"use strict";

var rootModule = angular.module('inventorySystem', [
    'ngAnimate',
    'ngCookies',
    'toastr',
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
                            '<ul class="sidebar-menu">',
                                '<li class="header text-aqua">Menu</li>',
                            '</ul>',
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