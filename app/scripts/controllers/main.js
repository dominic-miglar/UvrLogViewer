'use strict';

/**
 * @ngdoc function
 * @name uvrLogViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uvrLogViewerApp
 */
angular.module('uvrLogViewerApp')
  .controller('MainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $rootScope.navActive = 'main';
  }]);
