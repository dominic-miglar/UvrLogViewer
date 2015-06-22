'use strict';

var uvrLogViewerFilters = angular.module('uvrLogViewerFilters', []);

var UNDEFINED_VALUE = 'N/A';
var DIGITAL_VALUE_ON = 'EIN';
var DIGITAL_VALUE_OFF = 'AUS';

var formatDigitalValue = function (value) {
  if (value != 0 && value != 1) {
    return UNDEFINED_VALUE;
  }
  else {
    if (value == 0) {
      value =  DIGITAL_VALUE_OFF;
    }
    else if (value == 1) {
      value =  DIGITAL_VALUE_ON;
    }
    return value;
  }
};

var formatDegreeCelsiusValue = function (value) {
  return value.toFixed(1) + ' \xB0' + 'C';
};

var formatEnergyValue = function (value) {
  return value.energy + ' kWh / ' + value.power + ' kW';
}

uvrLogViewerFilters.filter('uvrValue', function () {
  return function(value, ioIdentifier) {
    var formattedValue = UNDEFINED_VALUE;
    if(value === undefined || ioIdentifier === undefined) {
      return formattedValue;
    }
    switch(ioIdentifier.type) {
      case 'analog':
        if (value.unit === undefined || value.value === undefined) {
          return formattedValue;
        }
        switch(value.unit) {
          case 'analog':
            formattedValue = formatDigitalValue(value.value);
            break;
          case 'digital':
            formattedValue = formatDigitalValue(value.value);
            break;
          case 'C':
            formattedValue = formatDegreeCelsiusValue(value.value);
            break;
          case 'l/min':
            formattedValue = value.value + 'l/min';
            break;
          case 'W/m2':
            formattedValue = value.value + 'W/m2';
            break;
        }
        break;
      case 'digital':
        formattedValue = formatDigitalValue(value.value);
        break;
      case 'energy':
        formattedValue = formatEnergyValue(value);
        break;
      default:
        return formattedValue;
        break;
    }
    return formattedValue;
  }
});
