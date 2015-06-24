'use strict';

/**
 * @ngdoc overview
 * @name uvrLogViewerApp
 * @description
 * # uvrLogViewerApp
 *
 * Main module of the application.
 */
angular
  .module('uvrLogViewerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'selectionModel',
    'nvd3ChartDirectives',
    'uvrLogViewerConfig',
    'uvrLogViewerApi',
    'uvrLogViewerConfig',
    'uvrLogViewerFilters'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/controllers', {
        templateUrl: 'views/controllers.html',
        controller: 'ControllersCtrl'
      })
      .when('/controllers/:controllerId', {
        templateUrl: 'views/controller.html',
        controller: 'ControllerCtrl'
      })
      .when('/controllers/:controllerId/analog', {
        templateUrl: 'views/controller-analog.html',
        controller: 'ControllerCtrl'
      })
      .when('/controllers/:controllerId/digital', {
        templateUrl: 'views/controller-digital.html',
        controller: 'ControllerCtrl'
      })
      .when('/controllers/:controllerId/energy', {
        templateUrl: 'views/controller-energy.html',
        controller: 'ControllerCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
