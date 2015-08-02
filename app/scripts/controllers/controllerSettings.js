'use strict';

angular.module('uvrLogViewerApp')
  .controller('controllerSettingsCtrl', ['$scope', '$rootScope', '$routeParams', 'Api', function ($scope, $rootScope, $routeParams, Api) {
    $rootScope.navActive = 'settings';
    
    $scope.controller = null;
    $scope.ioIdentifiers = null;
    $scope.analogIoIdentifiers = [];
    $scope.digitalIoIdentifiers = [];
    $scope.heatMeterIoIdentifiers = [];
    
    $scope.controllerId = $routeParams.controllerId;
    $scope.configurationSection = 'all';
  
    $scope.updateView = function() {
      Api.getController($scope.controllerId).then(
        function (response) {
          $scope.controller = response.data;
          Api.getIoIdentifiersForController($scope.controller).then(
            function (response) {
              $scope.ioIdentifiers = response.data;
              console.log($scope.ioIdentifiers);
              for (var i = 0; i < $scope.ioIdentifiers.length; i++) {
                var ioIdentifier = $scope.ioIdentifiers[i];
                switch(ioIdentifier.type) {
                  case 'analog':
                    $scope.analogIoIdentifiers.push(ioIdentifier);
                    break;
                  case 'digital':
                    $scope.digitalIoIdentifiers.push(ioIdentifier);
                    break;
                  case 'energy':
                    $scope.heatMeterIoIdentifiers.push(ioIdentifier);
                    break;
                }
              }
          });
      });
    };
    
    $scope.updateIoIdentifier = function (ioIdentifier) {
      Api.updateIoIdentifier(ioIdentifier).then(
        function (response) {
          console.log('Successfully updated ioIdentifier object!');
        },
        function (error) {
          console.log('An error occured while updating an ioIdentifier object: ');
          console.log(error);
        }
      );
    };
    
    
    $scope.updateController = function (controller) {
      Api.updateController(controller).then(
        function (response) {
          console.log('Successfully updated controller object!');
        },
        function (error) {
          console.log('An error occured while updating an controller object: ');
          console.log(error);
        }
      );
    };
  
    $scope.updateView();
  }]);
