'use strict';

angular.module('uvrLogViewerFilters').filter('uvrSpeed', function () {
  var speed = '';
  return function(value) {
    if (value === undefined || value.speed === undefined || value.speed == null) {
      speed = 'N/A';
    }
    else {
      speed = value.speed;
    }
    return speed;
  }
});
