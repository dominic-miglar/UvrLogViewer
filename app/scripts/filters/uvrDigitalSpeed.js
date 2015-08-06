'use strict';

var UNDEFINED_VALUE = 'N/A';
var DIGITAL_VALUE_ON = 'EIN';
var DIGITAL_VALUE_OFF = 'AUS';

var formatDigitalSpeedValue = function (value) {
  if (value.value != 0 && value.value != 1) {
    return UNDEFINED_VALUE;
  }
  else {
    if (value.value == 0) {
      value =  DIGITAL_VALUE_OFF;
    }
    else if (value.value == 1) {
      if(value.speed !== null) {
        value = DIGITAL_VALUE_ON + ' (' + value.speed + ')';
      } else {
        value = DIGITAL_VALUE_ON;
      }
    }
    return value;
  }
};

angular.module('uvrLogViewerFilters').filter('uvrDigitalSpeed', function () {
  return function(value, ioIdentifier) {
    var formattedValue = UNDEFINED_VALUE;
    if(value === undefined || ioIdentifier === undefined) {
      return formattedValue;
    }
    switch(ioIdentifier.type) {
      case 'digital':
        formattedValue = formatDigitalSpeedValue(value);
        break;
    }
    return formattedValue;
  }
});
