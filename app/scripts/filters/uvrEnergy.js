'use strict';

angular.module('uvrLogViewerFilters').filter('uvrEnergy', function () {
  var energy = '';
  return function(value) {
    if (value === undefined || value.energy === undefined || value.energy == null) {
      energy = 'N/A';
    }
    else {
      energy = value.energy + ' kWh';
    }
    return energy;
  }
});
