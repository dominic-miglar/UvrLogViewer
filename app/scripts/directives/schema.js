'use strict';

var uvrLogViewerApp = angular.module('uvrLogViewerApp');

var schemaDirective = function(uvrValueFilter, uvrDigitalSpeedFilter) {
  return {
    restrict: "E",
    replace: true,
    //template: "<object type='image/svg+xml' width='100%' height='100%' ng-attr-data='{{ vm.controller.schema.uploaded_file }}'></object>",
    template: "<svg id='schema' viewbox='0 0 1920 1080'></svg>",
    controller: 'ControllerCtrl',
    controllerAs: 'vm',
    link: function(scope, element, attrs, ctrl) {
      var valuesByIdentifierName = [];

      var updateValuesByIdentifierName = function() {
        for(var i = 0; i < ctrl.analogIoIdentifiers.length; i++) {
          var ioIdentifier = ctrl.analogIoIdentifiers[i];
          var fmtValue = uvrValueFilter(
            ctrl.latestValues[ioIdentifier.latest_value], 
            ioIdentifier
          );
          valuesByIdentifierName[ioIdentifier.name] = fmtValue;
          console.log(fmtValue);
        }
        for(var i = 0; i < ctrl.digitalIoIdentifiers.length; i++) {
          var ioIdentifier = ctrl.digitalIoIdentifiers[i];
          /*var fmtValue = uvrValueFilter(
            ctrl.latestValues[ioIdentifier.latest_value],
            ioIdentifier
          );*/
          var fmtValue = uvrDigitalSpeedFilter(
            ctrl.latestValues[ioIdentifier.latest_value],
            ioIdentifier
          );
          valuesByIdentifierName[ioIdentifier.name] = fmtValue;
        }
        for(var i = 0; i < ctrl.heatMeterIoIdentifiers.length; i++) {
          // TODO Power and Energy
        }
      };

      var updateValues = function() {
       updateValuesByIdentifierName();
       for(var name in valuesByIdentifierName) {
         if(document.getElementById(name) != null) {
           console.log('Setting ' + name + ' to value ' + valuesByIdentifierName[name]);
           document.getElementById(name).textContent = valuesByIdentifierName[name];
         }
       }
      };

      var generateSvg = function(newValue, oldValue) {
        if(newValue !== 'schema') {
          return null;
        }

        var s = Snap('#schema');
        Snap.load(ctrl.controller.schema.uploaded_file, function (data) {
          s.add(data);
          updateValues();
        });

      };
      scope.$watch('showValueType', generateSvg);
    }
  }
};

schemaDirective.$inject = ['uvrValueFilter', 'uvrDigitalSpeedFilter'];
uvrLogViewerApp.directive('schema', schemaDirective);

