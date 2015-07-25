'use strict';

var uvrLogViewerApp = angular.module('uvrLogViewerApp');

var schemaDirective = function(uvrValueFilter) {
  return {
    restrict: "E",
    replace: true,
    template: "<object type='image/svg+xml' width='100%' height='100%' data='http://10.0.0.8/heatSVG/drawing.svg'></object>",
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
          var fmtValue = uvrValueFilter(
            ctrl.latestValues[ioIdentifier.latest_value],
            ioIdentifier
          );
          valuesByIdentifierName[ioIdentifier.name] = fmtValue;
          console.log(fmtValue);

          // TODO: SPEED (Drehzahlstufe)
        }
        for(var i = 0; i < ctrl.heatMeterIoIdentifiers.length; i++) {
          // TODO Power and Energy
        }
      };

      var updateValues = function(svgDocument) {
        updateValuesByIdentifierName();
        for(var name in valuesByIdentifierName) {
          var svgTextElement = svgDocument.getElementById(name);
          if(svgTextElement != null) {
            svgTextElement.textContent = valuesByIdentifierName[name];
          }
        }
      };

      var generateSvg = function(newValue, oldValue) {
        if(newValue !== 'schema') {
          return null;
        }

        var svgObject = element[0];
        svgObject.addEventListener('load', function() {
          var svgDoc = svgObject.getSVGDocument();
          updateValues(svgDoc);
        }, false);

      };
      scope.$watch('showValueType', generateSvg);
      //generateSvg();
    }
  }
};

schemaDirective.$inject = ['uvrValueFilter'];
uvrLogViewerApp.directive('schema', schemaDirective);

