'use strict';

angular.module('uvrLogViewerApp')
  .controller('SettingsCtrl', ['$scope', '$rootScope', 'Api', function ($scope, $rootScope, Api) {
    $rootScope.navActive = 'settings';
  
    $scope.updateView = function() {
      Api.getControllers().then(
        function(response) {
          $scope.controllers = response.data
      });
    };
  
    $scope.updateView();
  }]);
