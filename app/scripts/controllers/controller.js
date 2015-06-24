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
    
    $scope.vizualizationData = [];
    
    $scope.xAxisTickFormatFunction = function () {
      return function (d) {
        return d3.time.format('%d.%m.%y %X')(new Date(d));
        //return d3.time.format('%X')(new Date(d));
      };
    };
    
    $scope.yAxisTickFormatFunction = function () {
      return function (d) {
        return d + ' \xB0C';
      };
    };
    
    $scope.xFunction = function () {
      return function (d) {
        return d[0];
      };
    };
    
    $scope.yFunction = function () {
      return function (d) {
        return d[1];
      };
    };
    
    $scope.colorArray = ['#00CC00', '#3300FF', '#CC0000', '#FFFF00', '#CC0099', '#00FFFF', '#8B4513'];
    
    $rootScope.navActive = 'controllers';
    $scope.showValueType = 'all';
    
    $scope.latestValues = new Array ();
    $scope.analogValues = new Array ();
    $scope.analogValuesForVisualization = new Array();
    
    $scope.controllerId = $routeParams.controllerId;
    
    $scope.colorFunction = function() {
      return function(d, i) {
        if (i > $scope.colorArray.length-1) {
          return $scope.colorArray[i % $scope.colorArray.length];
        }
        else {
          return $scope.colorArray[i];
        }
      };
    };
      
    $scope.getLatestAnalogValues = function () {
      for (var i = 0; i < $scope.analogIoIdentifiers.length; i++) {
        if ($scope.analogIoIdentifiers[i].latest_value != null) {
          Api.getAnalogValue($scope.analogIoIdentifiers[i].latest_value).then(
            function (response) {
              $scope.latestValues[response.data.id] = response.data;
            });
          }
        } 
    };
    
    $scope.getLatestDigitalValues = function () {
      for (var i = 0; i < $scope.digitalIoIdentifiers.length; i++) {
        if ($scope.digitalIoIdentifiers[i].latest_value != null) {
          Api.getDigitalValue($scope.digitalIoIdentifiers[i].latest_value).then(
            function (response2) {
              $scope.latestValues[response2.data.id] = response2.data;
            });
          }
        }
    };
    
    $scope.getLatestHeatMeterValues = function () {
      for (var i = 0; i < $scope.heatMeterIoIdentifiers.length; i++) {
        if ($scope.heatMeterIoIdentifiers[i].latest_value != null) {
          Api.getHeatMeterValue($scope.heatMeterIoIdentifiers[i].latest_value).then(
            function (response2) {
              $scope.latestValues[response2.data.id] = response2.data;
            });
          }
        }
    };
    
    $scope.getAnalogIoIdentifiers = function () {
      Api.getAnalogIoIdentifiersForController($scope.controller).then(
        function (response) {
          $scope.analogIoIdentifiers = response.data;
          console.log(response.data);
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
    
    $scope.getAnalogIoIdentifierDescription = function (ioIdentifierId) {
      var ioIdentifierDescription = '';
      for(var i = 0; i < $scope.analogIoIdentifiers.length; i++) {
        if ($scope.analogIoIdentifiers[i].id === ioIdentifierId) {
          ioIdentifierDescription = $scope.analogIoIdentifiers[i].description;
          break;
        }
      }
      if(ioIdentifierDescription === '') {
        return null;
      }
      return ioIdentifierDescription;
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
    
    $scope.getAnalogValuesForIoIdentifier = function (ioIdentifier) {
      Api.getAnalogValuesForIoIdentifier(ioIdentifier.id, 1).then(
        function (response) {
          $scope.analogValues[ioIdentifier.id] = response.data;
          $scope.prepareAnalogValuesForVisualization(ioIdentifier);
        }
      );
    };
    
    $scope.removeAnalogIoIdentifierFromGraph = function (ioIdentifier) {
      var arrayIndex = -1;
      for (var i = 0; i < $scope.vizualizationData.length; i++) {
        if ($scope.vizualizationData[i].key === ioIdentifier.description || $scope.vizualizationData[i].key === ioIdentifier.name) {
          arrayIndex = i;
          break;
        }
      }
      if (arrayIndex !== -1) {
        $scope.vizualizationData.splice(arrayIndex, 1);
      }
    };
    
    $scope.prepareAnalogValuesForVisualization = function (ioIdentifier) {
      var graphObj = {};
      //var ioIdentifierDescription = $scope.getAnalogIoIdentifierDescription(ioIdentifierId);
      var ioIdentifierDescription = ioIdentifier.description;
      if (ioIdentifierDescription === null) {
        ioIdentifierDescription = ioIdentifier.name;
      }
      graphObj['key'] = ioIdentifierDescription;
      graphObj['values'] = [];
      for (var i=0; i < $scope.analogValues[ioIdentifier.id].length; i++) {
        if($scope.analogValues[ioIdentifier.id].length > 10000) {
          if(i % 100 != 0) {
            console.log("skip..");
            continue;
          }
        }
        var loggedValue = $scope.analogValues[ioIdentifier.id][i];
        console.log(loggedValue);
        var loggedDataDate = new Date(loggedValue.datetime);
        console.log(loggedDataDate);
        var loggedData = [Date.parse(loggedDataDate), loggedValue.value];
        graphObj.values.push(loggedData);
      }
      console.log('Successfully prepared data for identifier ' + ioIdentifier.id + ' (' + graphObj['key'] + ')');
      if (graphObj.values.length > 0) {
        // Save to analogValuesForVisualization for later usage    
        $scope.analogValuesForVisualization[ioIdentifier.id] = graphObj;
        // Push to vizualizationData List to show the prepared values up in the graph
        $scope.vizualizationData.push(graphObj);
      }
    };
    
    $scope.onAnalogIoIdentifierSelectionChanged = function(ioIdentifier) {
      switch(ioIdentifier.selected) {
        case true:
          console.log('Selected ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
          if ($scope.analogValuesForVisualization[ioIdentifier.id] !== undefined) {
            console.log('Using previously prepared data for ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
            $scope.vizualizationData.push($scope.analogValuesForVisualization[ioIdentifier.id]);
          }
          else {
            $scope.getAnalogValuesForIoIdentifier(ioIdentifier);
          }
          break;
        case false:
          console.log('Unselected ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
          $scope.removeAnalogIoIdentifierFromGraph(ioIdentifier);
          break;
      }
    };
      
    $scope.updateView();
  }]);
