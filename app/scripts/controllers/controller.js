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
    var vm = this;

    $rootScope.navActive = 'controllers';
    $scope.showValueType = 'all';
    $scope.analogVizualizationData = [];
    $scope.digitalVizualizationData = [];
    $scope.latestValues = [];
    vm.latestValues = $scope.latestValues;
    $scope.analogIoIdentifiers = [];
    $scope.digitalIoIdentifiers = [];
    $scope.heatMeterIoIdentifiers = [];
    $scope.analogValues = [];
    $scope.digitalValues = [];
    $scope.analogValuesForVisualization = [];
    $scope.digitalValuesForVisualization = [];
    $scope.controllerId = $routeParams.controllerId;
    $scope.colorArray = ['#00CC00', '#3300FF', '#CC0000', '#FFFF00', '#CC0099', '#00FFFF', '#8B4513'];
    

    this.getTestValue = function() {
      return 'UFO';
    };
    
    $scope.xAxisTickFormatFunction = function () {
      return function (d) {
        return d3.time.format('%d.%m.%y %X')(new Date(d));
        //return d3.time.format('%X')(new Date(d));
      };
    };
    
    $scope.analogChartYAxisTickFormatFunction = function () {
      return function (d) {
        return d + ' \xB0C';
      };
    };
    
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
          vm.analogIoIdentifiers = response.data;
          $scope.getLatestAnalogValues();
      });
    };
    
    $scope.getDigitalIoIdentifiers = function () {
      Api.getDigitalIoIdentifiersForController($scope.controller).then(
        function (response) {
          $scope.digitalIoIdentifiers = response.data;
          vm.digitalIoIdentifiers = response.data;
          $scope.getLatestDigitalValues();
      });
    };
    
    $scope.getHeatMeterIoIdentifiers = function () {
      Api.getHeatMeterIoIdentifiersForController($scope.controller).then(
        function (response) {
          $scope.heatMeterIoIdentifiers = response.data;
          vm.heatMeterIoIdentifiers = response.data;
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
          vm.controller = response.data;
          $scope.getSchema();
          $scope.getAnalogIoIdentifiers();
          $scope.getDigitalIoIdentifiers();
          $scope.getHeatMeterIoIdentifiers();
      });
    };

    $scope.getSchema = function () {
      var promise = Api.getSchemaForController($scope.controller);
      if(promise === null) {
        $scope.controller.schema = null;
        vm.controller.schema = null;
      }
      else {
        promise.then(
          function (response) {
            $scope.controller.schema = response.data;
            vm.controller.schema = response.data;
            console.log('Schema here: ');
            console.log($scope.controller.schema);
          }
        );
      }
    };
    
    $scope.getAnalogValuesForIoIdentifier = function (ioIdentifier) {
      Api.getAnalogValuesForIoIdentifier(ioIdentifier.id, 1).then(
        function (response) {
          $scope.analogValues[ioIdentifier.id] = response.data;
          $scope.prepareAnalogValuesForVisualization(ioIdentifier);
        }
      );
    };
    
    $scope.getDigitalValuesForIoIdentifier = function (ioIdentifier) {
      Api.getDigitalValuesForIoIdentifier(ioIdentifier.id, 1).then(
        function (response) {
          $scope.digitalValues[ioIdentifier.id] = response.data;
          $scope.prepareDigitalValuesForVisualization(ioIdentifier);
        },
        function (error) {
          console.log('Error while retrieving ditital values for io identifier ' + ioIdentifier.id);
        }
      );
    };
    
    $scope.removeAnalogIoIdentifierFromGraph = function (ioIdentifier) {
      var arrayIndex = -1;
      for (var i = 0; i < $scope.analogVizualizationData.length; i++) {
        if ($scope.analogVizualizationData[i].key === ioIdentifier.description || $scope.analogVizualizationData[i].key === ioIdentifier.name) {
          arrayIndex = i;
          break;
        }
      }
      if (arrayIndex !== -1) {
        $scope.analogVizualizationData.splice(arrayIndex, 1);
      }
    };
    
    $scope.removeDigitalIoIdentifierFromGraph = function (ioIdentifier) {
      var arrayIndex = -1;
      for (var i = 0; i < $scope.digitalVizualizationData.length; i++) {
        if ($scope.digitalVizualizationData[i].key === ioIdentifier.description || $scope.digitalVizualizationData[i].key === ioIdentifier.name) {
          arrayIndex = i;
          break;
        }
      }
      if (arrayIndex !== -1) {
        $scope.digitalVizualizationData.splice(arrayIndex, 1);
      }
    };
    
    $scope.prepareAnalogValuesForVisualization = function (ioIdentifier) {
      var graphObj = {};
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
        var loggedDataDate = new Date(loggedValue.datetime);
        var loggedData = [Date.parse(loggedDataDate), loggedValue.value];
        graphObj.values.push(loggedData);
      }
      console.log('Successfully prepared data for identifier ' + ioIdentifier.id + ' (' + graphObj['key'] + ')');
      if (graphObj.values.length > 0) {
        // Save to analogValuesForVisualization for later usage    
        $scope.analogValuesForVisualization[ioIdentifier.id] = graphObj;
        // Push to vizualizationData List to show the prepared values up in the graph
        $scope.analogVizualizationData.push(graphObj);
      }
    };
    
    $scope.prepareDigitalValuesForVisualization = function (ioIdentifier) {
      var graphObj = {};
      var ioIdentifierDescription = ioIdentifier.description;
      if (ioIdentifierDescription === null) {
        ioIdentifierDescription = ioIdentifier.name;
      }
      graphObj['key'] = ioIdentifierDescription;
      graphObj['values'] = [];
      for (var i=0; i < $scope.digitalValues[ioIdentifier.id].length; i++) {
        if($scope.digitalValues[ioIdentifier.id].length > 10000) {
          if(i % 100 != 0) {
            console.log("skip..");
            continue;
          }
        }
        var loggedValue = $scope.digitalValues[ioIdentifier.id][i];
        var loggedDataDate = new Date(loggedValue.datetime);
        var loggedData = [Date.parse(loggedDataDate), loggedValue.value];
        graphObj.values.push(loggedData);
      }
      console.log('Successfully prepared data for identifier ' + ioIdentifier.id + ' (' + graphObj['key'] + ')');
      if (graphObj.values.length > 0) {
        // Save to analogValuesForVisualization for later usage    
        $scope.digitalValuesForVisualization[ioIdentifier.id] = graphObj;
        // Push to vizualizationData List to show the prepared values up in the graph
        $scope.digitalVizualizationData.push(graphObj);
      }
    };
    
    $scope.onAnalogIoIdentifierSelectionChanged = function(ioIdentifier) {
      switch(ioIdentifier.selected) {
        case true:
          console.log('Selected ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
          if ($scope.analogValuesForVisualization[ioIdentifier.id] !== undefined) {
            console.log('Using previously prepared data for ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
            $scope.analogVizualizationData.push($scope.analogValuesForVisualization[ioIdentifier.id]);
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
    
    $scope.onDigitalIoIdentifierSelectionChanged = function(ioIdentifier) {
      switch(ioIdentifier.selected) {
        case true:
          console.log('Selected ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
          if ($scope.digitalValuesForVisualization[ioIdentifier.id] !== undefined) {
            console.log('Using previously prepared data for ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
            $scope.digitalVizualizationData.push($scope.digitalValuesForVisualization[ioIdentifier.id]);
          }
          else {
            $scope.getDigitalValuesForIoIdentifier(ioIdentifier);
          }
          break;
        case false:
          console.log('Unselected ' + ioIdentifier.name + ' (' + ioIdentifier.description + ')');
          $scope.removeDigitalIoIdentifierFromGraph(ioIdentifier);
          break;
      }
    };

    /*$scope.$watch('showValueType', function(current, original) {
      if(current === original)  {
        return null;
      }
      if(current === 'schema') {
        console.log('NOW SCHEMA!');
        // Get the Object by ID
        //var a = document.getElementById("svgObject");
        //console.log(a);
        // Get the SVG document inside the Object tag
        //var svgDoc = a.contentDocument;
        // Get one of the SVG items by ID;
        //var svgItem = svgDoc.getElementById("Analog1");
        //svgItem.textContent = 'ABC';
        var statusElm = document.getElementById("svgObject")
          .getSVGDocument().getElementById("Analog1");
        console.log(statusElm);
        statusElm.textContent = '45.2 °C';
      }
    });*/
      
    $scope.updateView();
  }]);
