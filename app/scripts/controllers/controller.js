'use strict';

/**
 * @ngdoc function
 * @name uvrLogViewerApp.controller:ControllerCtrl
 * @description
 * # ControllerCtrl
 * Controller of the uvrLogViewerApp
 */


angular.module('uvrLogViewerApp')
  .controller('ControllerCtrl', ['$scope', '$rootScope', '$routeParams', 'Api', function ($scope, $rootScope, $routeParams, Api) {
    $rootScope.navActive = 'controllers';
    $scope.showValueType = 'all';
    
    $scope.latestValues = new Array ();
    $scope.controllerId = $routeParams.controllerId;
      
    $scope.getLatestAnalogValues = function () {
      for (var i = 0; i < $scope.analogIoIdentifiers.length; i++) {
        Api.getAnalogValue($scope.analogIoIdentifiers[i].latest_value).then(
          function (response2) {
            $scope.latestValues[response2.data.id] = response2.data;
          });
        }
    };
    
    $scope.getLatestDigitalValues = function () {
      for (var i = 0; i < $scope.digitalIoIdentifiers.length; i++) {
        Api.getDigitalValue($scope.digitalIoIdentifiers[i].latest_value).then(
          function (response2) {
            $scope.latestValues[response2.data.id] = response2.data;
          });
        }
    };
    
    $scope.getLatestHeatMeterValues = function () {
      for (var i = 0; i < $scope.heatMeterIoIdentifiers.length; i++) {
        Api.getHeatMeterValue($scope.heatMeterIoIdentifiers[i].latest_value).then(
          function (response2) {
            $scope.latestValues[response2.data.id] = response2.data;
          });
        }
    };
    
    $scope.getAnalogIoIdentifiers = function () {
      Api.getAnalogIoIdentifiersForController($scope.controller).then(
        function (response) {
          $scope.analogIoIdentifiers = response.data;
          $scope.getLatestAnalogValues();
      });
    };
    
    $scope.getDigitalIoIdentifiers = function () {
      Api.getDigitalIoIdentifiersForController($scope.controller).then(
        function (response) {
          $scope.digitalIoIdentifiers = response.data;
          $scope.getLatestDigitalValues();
      });
    };
    
    $scope.getHeatMeterIoIdentifiers = function () {
      Api.getHeatMeterIoIdentifiersForController($scope.controller).then(
        function (response) {
          $scope.heatMeterIoIdentifiers = response.data;
          $scope.getLatestHeatMeterValues();
      });
    };
    
    $scope.updateView = function () {
      Api.getController($scope.controllerId).then(
        function (response) {
          $scope.controller = response.data;
          $scope.getAnalogIoIdentifiers();
          $scope.getDigitalIoIdentifiers();
          $scope.getHeatMeterIoIdentifiers();
      });
    };
  
    $scope.updateView();
  }]);
