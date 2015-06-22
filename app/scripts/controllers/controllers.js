'use strict';

/**
 * @ngdoc function
 * @name uvrLogViewerApp.controller:ControllersCtrl
 * @description
 * # ControllersCtrl
 * Controller of the uvrLogViewerApp
 */


angular.module('uvrLogViewerApp')
  .controller('ControllersCtrl', ['$scope', '$rootScope', 'Api', function ($scope, $rootScope, Api) {
    $rootScope.navActive = 'controllers';
  
    $scope.updateView = function() {
      Api.getControllers().then(
        function(response) {
          $scope.controllers = response.data
      });
    };
  
    $scope.updateView();
  }]);
