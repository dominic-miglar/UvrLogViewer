'use strict';

angular.module('uvrLogViewerFilters').filter('uvrPower', function () {
  var power = '';
  return function(value) {
    if (value === undefined || value.power === undefined || value.power == null) {
      power = 'N/A';
    }
    else {
      power = value.power + ' kW';
    }
    return power;
  }
});
